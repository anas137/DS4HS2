import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-wamhost-wc',
  standalone: true,
  imports: [RouterOutlet, WamhostWCComponent],
  templateUrl: './wamhost-wc.component.html',
  styleUrl: './wamhost-wc.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WamhostWCComponent {
  title = 'wam-app';
  path: string = '';
  ui = undefined;
  audioContext = new AudioContext();

  constructor(private route: ActivatedRoute) {
    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.path = "https://www.webaudiomodules.com/community/plugins/" + params['path'];
      console.log(this.path);
      this.init();

    });
    console.log("init");
  }

  async init() {
    let hostKey;

    const initHost = async (audioContext:any) => {
      const scriptUrl = 'https://mainline.i3s.unice.fr/wam2/packages/sdk/src/initializeWamHost.js';
      const {default: initializeWamHost} = (await import(/* @vite-ignore */ scriptUrl)) as any;

      const [, key] = await initializeWamHost(audioContext, "example");
      hostKey = key;
    };
    const audioElement = <HTMLAudioElement>document.getElementById('player');
    const track = this.audioContext.createMediaElementSource(audioElement);

    await this.initHost(this.audioContext); // Ensure the host is initialized before loading the WAM
    this.run(this.path, track);
    
  }

  async initHost(audioContext: AudioContext) {
    const scriptUrl = 'https://mainline.i3s.unice.fr/wam2/packages/sdk/src/initializeWamHost.js';
    const { default: initializeWamHost } = await import(/* @vite-ignore */ scriptUrl);
    const [, key] = await initializeWamHost(audioContext, "example");
    return key;
  }

  async run(wamUrl: string, track: MediaElementAudioSourceNode) {
    const wam = await this.loadWAM(wamUrl);
    this.ui = await wam.createGui();
    document.querySelector("#wam")?.appendChild(this.ui);

    track.connect(wam.audioNode); // Connect the audio track to the WAM
    wam.audioNode.connect(this.audioContext.destination); // Ensure WAM output is routed to the speakers
  }

  async loadWAM(path: string) {
    console.log("Loading WAM from:", path);
    const { default: WAM } = await import(/* @vite-ignore */ path);
    if (typeof WAM !== 'function' || !WAM.isWebAudioModuleConstructor) {
      throw new Error(`Path ${path} is not a WebAudioModule.`);
    }
    const instance = new WAM("example", this.audioContext);
    await instance.initialize({});
    return instance;
  }

}