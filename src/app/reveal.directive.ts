import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;
    element.classList.add('reveal');

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          // pumasok sa screen: simulan ang animation
          element.classList.add('in-view');
        } else if (!entry.isIntersecting) {
          // tuluyang lumabas sa screen: i-reset para maulit
          element.classList.remove('in-view');
        }
      },
      { threshold: [0, 0.15], rootMargin: '0px 0px -8% 0px' }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}