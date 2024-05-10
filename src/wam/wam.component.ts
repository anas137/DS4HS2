import { Component, OnInit, ElementRef, ViewChild,AfterViewInit, Renderer2,Input, OnChanges, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wam',
  templateUrl: './wam.component.html',
  styleUrl: './wam.component.css'
})
export class WamComponent implements AfterViewInit{
   path: string = '';
  @ViewChild('player') playerRef: ElementRef<HTMLAudioElement>;
  @ViewChild('wam') wamRef: ElementRef;
  audioContext = new AudioContext();
  mediaElementSource: MediaElementAudioSourceNode;


  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
   
    this.route.params.subscribe(params => {
      this.path = params['path'];
      console.log(this.path); 
    });
    
  }
  
  ngAfterViewInit() {
    this.playerRef.nativeElement.onplay = () => {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
    };
    this.init();
  }

  async init() {
    this.mediaElementSource = this.audioContext.createMediaElementSource(this.playerRef.nativeElement);
    await this.run(this.path);
  }

  async run(wamUrl: string) {
    const scriptUrl = 'https://mainline.i3s.unice.fr/wam2/packages/sdk/src/initializeWamHost.js';
    const { default: initializeWamHost } = await import(/* @vite-ignore */ scriptUrl);
    const [, hostKey] = await initializeWamHost(this.audioContext, "example");

    const { default: WAM } = await import(/* @vite-ignore */ wamUrl);
    const instance = new WAM("example", this.audioContext);
    await instance.initialize({});

    const audioNode = instance.audioNode;
    this.mediaElementSource.connect(audioNode);
    audioNode.connect(this.audioContext.destination);

    const ui = await instance.createGui();
    this.wamRef.nativeElement.appendChild(ui);
  }

}