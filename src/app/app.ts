import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { RevealDirective } from './reveal.directive';
import { NetworkBgDirective } from './network-bg.directive';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, NgForm } from '@angular/forms';


export interface ProjectMedia {
  type: 'image' | 'video';
  src: string;        // path ng larawan o video (hal. 'assets/projects/ems-1.png')
  caption?: string;   // optional na paliwanag sa ilalim ng larawan/video
  poster?: string;    // optional na thumbnail para sa video
}

export interface Project {
  number: string;
  title: string;
  description: string;
  technologies: string[];
  type: string;
  github: string;
  image: string;        // cover (optional). Kung wala, gagamitin ang unang image sa media
  media: ProjectMedia[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    RevealDirective,
    NetworkBgDirective,
    MatIconModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnDestroy {
  // Projects carousel state
  activeProject = 0;
  galleryOpen = false;
  galleryIndex = 0;
  private touchStartX = 0;
  private jumping = new Set<number>(); // mga slide na tatalon mula kaliwa papuntang kanan (o baliktad)

  name = 'Rupert Navo';
  role = 'Software Developer';
  year = new Date().getFullYear();
  email = 'your.email@example.com';

  experiences = [
    {
      title: 'Website & Automation Developer',
      company: 'Physically Primal / Aettir',
      period: 'July 2026 to August 2026',
      responsibilities: [
        'Build a website to expand the business of the owner',
        'Maintain the website', 
        'Enhance the website', 
        'Troubleshoot some of the errors of existing automation and website',
        'Added some workflows for the new process'
      ],
      technologies: ['GHL', 'HTML', 'Javascript', 'CSS', 'Zapier']
    },
    {
      title: 'Software Developer',
      company: 'H2 Software Consulting Services, Inc.',
      period: 'July 2023 to July 2026',
      responsibilities: [
        'Debugged and resolved system issues ensuring smooth performance across payroll and timekeeping modules.',
        'Maintained and enhanced existing features based on user feedback and business requirements.',
        'Created and maintained technical documentation to support ongoing development and future maintenance.',
        'Worked with SQL Server and relational databases.',
        'Collaborated with stakeholders to gather requirements and translate them into functional modules for a full lending management system; built key features including client loan processing, cash tracking, and reporting dashboards.',
        'Implemented secure role-based access control (RBAC) and REST API protection using JWT tokens with robust data validation and error handling.',
        'Optimized database performance using SQL Server, LINQ queries, and stored procedures handled production deployment via IIS and managed version control using Sourcetree and GitLab.',
        'Assisted in deploying applications to production and performed post-deployment validation to ensure system stability and accuracy.',
        'Prepared and maintained project documentation; supported System Integration Testing (SIT) and User Acceptance Testing (UAT).',
        'Participated in the full SDLC using Waterfall methodology, from requirements and data gathering with business users through to production deployment.'
      ],
      technologies: ['Html', 'CSS', 'Javascript', 'Bootstrap', 'Jquery', 'Ajax', 'Blazor', 'C#', '.NET Core', 'ASP.Net Core', 'ASP.Net Core API', 'Entity Framework', 'LINQ', 'MS SQL', 'SSIS', 'Windows Service', 'Oracle']
    },
    {
      title: 'Rig Admin',
      company: 'Pacific Seamen Services Inc.',
      period: 'January 2022 - February 2023',
      responsibilities: [
        'Manage crew logistics including room, hotel, and flight or chopper arrangements, plus tracking crew movement and onboard lists.',
        'Handle admin tasks such as flight bookings, emails, timesheets, and rig documentation.',
        'Provide administrative support to the Master/Rig Manager, including weather reports for chopper flights.',
      ]
    },
    {
      title: 'Sales Clerk',
      company: 'Homeworld Shopping Corporation',
      period: 'April 2019 - May 2020',
      responsibilities: [
        'Greet customers warmly and help them find what they need.',
        'Keep track of items running low and assist with restocking.',
        'Help customers complete their purchases and keep the storeroom clean and organized.',
      ]
    },
    {
      title: 'IT Staff',
      company: 'Win Fortune Travel Agency Inc.',
      period: 'June 2018 – February 2019',
      responsibilities: [
        'Monitored and maintained computer systems and networks; handled system and network troubleshooting.',
        'Performed maintenance and repairs on desktops and printers',
        'Managed IT documentation and reporting.',
      ]
    },
    {
      title: 'Technical Support',
      company: 'AMTI',
      period: 'February 2017 - May 2018',
      responsibilities: [
        'Configured hardware units, set IP addresses and DNS servers; updated Symantec antivirus and Windows systems.',
        'Set up DNS server to enable VM Windows XP machines to join the network domain.',
        'Reimage new system units to align it to the requirements of the company',
      ]
    }
  ];

  projects: Project[] = [
    {
      number: '01',
      title: 'Triple A Lending System',
      description:
        'A system for monitoring the status of loan transactions',
      technologies: ['Blazor', 'Javascript', 'C#', 'Entity Framework', '.NET Core', 'Asp.Net Web API', 'LINQ', 'MS SQL'],
      type: 'Full Stack Development',
      github: '',
      image: 'assets/img-triplea/triplea10.png',
      media: [
        { type: 'image', src: 'assets/img-triplea/triplea10.png', caption: '' },
        { type: 'image', src: 'assets/img-triplea/triplea1.png', caption: '' },
        { type: 'image', src: 'assets/img-triplea/triplea2.png', caption: '' },
        { type: 'image', src: 'assets/img-triplea/triplea3.png', caption: '' },
        { type: 'image', src: 'assets/img-triplea/triplea4.png', caption: '' },
        { type: 'image', src: 'assets/img-triplea/triplea5.png', caption: '' },
        { type: 'image', src: 'assets/img-triplea/triplea6.png', caption: '' },
        { type: 'image', src: 'assets/img-triplea/triplea7.png', caption: '' },
        { type: 'image', src: 'assets/img-triplea/triplea8.png', caption: '' },
        { type: 'image', src: 'assets/img-triplea/triplea9.png', caption: '' },
      ]
    },
    {
      number: '02',
      title: 'Aettir Website',
      description:
        'Website that collect the information of the lead before to proceed on booking schedule',
      technologies: ['GoHighLevel', 'Javascript', 'CSS', 'Zapier'],
      type: 'Website',
      github: '',
      image: 'assets/img-aettir/aettir1.png',
      media: [
        { type: 'image', src: 'assets/img-aettir/aettir1.png', caption: '' },
        { type: 'image', src: 'assets/img-aettir/aettir2.png', caption: '' },
        { type: 'image', src: 'assets/img-aettir/aettir3.png', caption: '' },
        { type: 'image', src: 'assets/img-aettir/aettir4.png', caption: '' },
        { type: 'image', src: 'assets/img-aettir/aettir5.png', caption: '' },
        { type: 'image', src: 'assets/img-aettir/aettir6.png', caption: '' },
        { type: 'image', src: 'assets/img-aettir/aettir7.png', caption: '' },
        { type: 'image', src: 'assets/img-aettir/aettir8.png', caption: '' },
        { type: 'image', src: 'assets/img-aettir/aettir9.png', caption: '' },
        { type: 'image', src: 'assets/img-aettir/aettir10.png', caption: '' },
      ]
    },
    {
      number: '03',
      title: 'MT301',
      description:
      'Automates daily business operations through robust ETL processing, driving workflow efficiency and data accuracy.',
      technologies: ['SSIS', 'C#', 'SQL Server'],
      type: 'Back End Application',
      github: '',
      image: '',
      media: [
        { type: 'image', src: 'assets/images/MT301.png', caption: '' }
      ]
    },
    {
      number: '04',
      title: 'C1195 Remittance Notification',
      description:
      'An automated windows service built to deliver instant email updates to beneficiaries and business users, ensuring complete end-to-end transaction visibility.',
      technologies: ['Windows Service', 'C#', 'Oracle'],
      type: 'Back End Application',
      github: '',
      image: '',
      media: [
      { type: 'image', src: 'assets/images/C1195.png', caption: '' }
      ]
    },
    {
      number: '05',
      title: 'ATM Aquirer',
      description:
      'An automated backend service that processes ATM transaction data and generates entry files to simplify daily financial reconciliation.',
      technologies: ['SSIS', 'C#', 'Oracle', 'SQL Server'],
      type: 'Back End Application',
      github: '',
      image: '',
      media: [
      { type: 'image', src: 'assets/images/ATM Acquirer.png', caption: '' }

      ]
    }
  ];

  skillGroups = [
    {
      title: 'Frontend',
      skills: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Ajax', 'Bootstrap', 'Blazor', 'Angular']
    },
    {
      title: 'Backend',
      skills: ['C#', '.NET', 'ASP.NET Core', 'LINQ', 'Entity Framework', 'ASP.NET Core API']
    },
    {
      title: 'Database',
      skills: ['SQL Server', 'MS SQL', 'SSIS', 'Oracle']
    },
    {
      title: 'Tools',
      skills: ['Sourcetree', 'Gitlab', 'VS Code', 'Visual Studio', 'GoHighLevel', 'Zapier']    
    }
  ];

  private readonly skillIcons: Record<string, string> = {
    'Angular': 'devicon-angular-plain colored',
    'JavaScript': 'devicon-javascript-plain colored',
    'HTML': 'devicon-html5-plain colored',
    'CSS': 'devicon-css3-plain colored',
    'Bootstrap': 'devicon-bootstrap-plain colored',
    'jQuery': 'devicon-jquery-plain colored',
    'Ajax': 'devicon-javascript-plain colored',
    'Blazor' : 'devicon-blazor-plain colored',

    'C#': 'devicon-csharp-plain colored',
    '.NET': 'devicon-dotnetcore-plain colored',
    'ASP.NET Core': 'devicon-dotnetcore-plain colored',
    'ASP.NET Core API': 'devicon-dotnetcore-plain colored',
    'LINQ': 'devicon-csharp-plain colored',
    'Entity Framework': 'devicon-dotnetcore-plain colored',

    'SQL Server': 'devicon-microsoftsqlserver-plain colored',
    'SSIS': 'devicon-microsoftsqlserver-plain colored',
    'Oracle': 'devicon-oracle-original colored',
    'MS SQL': 'devicon-microsoftsqlserver-plain colored',

    'Sourcetree': 'devicon-sourcetree-plain colored',
    'Gitlab': 'devicon-gitlab-plain colored',
    'VS Code': 'devicon-vscode-plain colored',
    'Visual Studio': 'devicon-visualstudio-plain colored',
    'GoHighLevel': 'assets/icons/GHL.png',
    'Zapier': 'assets/icons/zapier.png', 

  };

  // about strengths card
  strengths = [
    { icon: 'lightbulb',   title: 'Problem Solver',          description: '' },
    { icon: 'school',      title: 'Fast Learner',            description: '' },
    { icon: 'sync',        title: 'Adaptable',               description: '' },
    { icon: 'trending_up', title: 'Continuous Improvement',  description: '' },
    { icon: 'wb_sunny',      title: 'Optimistic',              description: '' },
    { icon: 'handyman',  title: 'Resourceful',             description: '' }
  ];

  activeStrength = 0;

  nextStrength(): void {
  this.activeStrength = (this.activeStrength + 1) % this.strengths.length;
  }

  getStrengthStyle(index: number): Record<string, string> {
    const total = this.strengths.length;
    const depth = (index - this.activeStrength + total) % total;
    const level = Math.min(depth, 3);

    const rotate = [-4, 5, -8, 9][level];
    const x = [0, 18, -16, 22][level];
    const y = [0, 12, 22, 30][level];
    const scale = [1, 0.96, 0.92, 0.88][level];
    const opacity = [1, 1, 0.8, 0][level];

    return {
      transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
      opacity: String(opacity),
      zIndex: String(total - depth)
    };
  }
  // end of about strengths card

  // ---- Projects coverflow carousel ----

  selectProject(index: number): void {
    const total = this.projects.length;
    const next = ((index % total) + total) % total; 

    this.jumping.clear();
    this.projects.forEach((_, i) => {
      if (Math.abs(this.slideOffset(i, next) - this.slideOffset(i)) > 1) {
        this.jumping.add(i);
      }
    });

    this.activeProject = next;
  }

  // Pinakamaikling distansya ng slide mula sa aktibo (negatibo = kaliwa, positibo = kanan)
  private slideOffset(index: number, active: number = this.activeProject): number {
    const total = this.projects.length;
    let offset = (index - active) % total;
    if (offset > total / 2) offset -= total;
    else if (offset < -total / 2) offset += total;
    return offset;
  }

  nextProject(): void {
    if (this.galleryOpen) return;
    this.selectProject(this.activeProject + 1);
  }

  prevProject(): void {
    if (this.galleryOpen) return;
    this.selectProject(this.activeProject - 1);
  }

  onSlideClick(index: number): void {
    if (index === this.activeProject) {
      this.openGallery();
    } else {
      this.selectProject(index);
    }
  }

  coverOf(project: Project): string {
    return (
      project.image ||
      project.media.find(item => item.type === 'image')?.src ||
      ''
    );
  }

    // ---- Gallery popup ----

  fitMode = false;
  scrollHint = false;  

  get selectedProject(): Project {
    return this.projects[this.activeProject];
  }

  openGallery(): void {
    (document.activeElement as HTMLElement | null)?.blur();
    this.galleryIndex = 0;
    this.galleryOpen = true;
    document.body.style.overflow = 'hidden';
    this.onMediaChanged();
  }

  closeGallery(): void {
    this.galleryOpen = false;
    this.scrollHint = false;
    document.body.style.overflow = '';
  }

  nextMedia(): void {
    const total = this.selectedProject.media.length;
    if (!total) return;
    this.galleryIndex = (this.galleryIndex + 1) % total;
    this.onMediaChanged();
  }

  prevMedia(): void {
    const total = this.selectedProject.media.length;
    if (!total) return;
    this.galleryIndex = (this.galleryIndex - 1 + total) % total;
    this.onMediaChanged();
  }

  selectMedia(index: number): void {
    this.galleryIndex = index;
    this.onMediaChanged();
  }

  toggleFit(): void {
    this.fitMode = !this.fitMode;
    this.scrollHint = false;
    setTimeout(() => this.checkOverflow());
  }

  onMediaLoad(): void {
    this.checkOverflow();
  }

  onGalleryScroll(event: Event): void {
    if ((event.target as HTMLElement).scrollTop > 20) {
      this.scrollHint = false;
    }
  }

  private onMediaChanged(): void {
    this.scrollHint = false;
    setTimeout(() => {
      this.checkOverflow();
      document.querySelector('.thumb.active')?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    });
  }

  private checkOverflow(): void {
    const box = document.querySelector<HTMLElement>('.gallery-scroll');
    this.scrollHint =
      !!box &&
      !this.fitMode &&
      box.scrollHeight > box.clientHeight + 8 &&
      box.scrollTop < 20;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.galleryOpen) return;

    const box = document.querySelector<HTMLElement>('.gallery-scroll');
    const page = (box?.clientHeight ?? 400) * 0.9;

    switch (event.key) {
      case 'Escape':
        this.closeGallery();
        break;
      case 'ArrowRight':
        this.nextMedia();
        break;
      case 'ArrowLeft':
        this.prevMedia();
        break;
      case 'ArrowDown':
        box?.scrollBy({ top: 120, behavior: 'smooth' });
        event.preventDefault();
        break;
      case 'ArrowUp':
        box?.scrollBy({ top: -120, behavior: 'smooth' });
        event.preventDefault();
        break;
      case 'PageDown':
        box?.scrollBy({ top: page, behavior: 'smooth' });
        event.preventDefault();
        break;
      case 'PageUp':
        box?.scrollBy({ top: -page, behavior: 'smooth' });
        event.preventDefault();
        break;
      case 'Home':
        box?.scrollTo({ top: 0, behavior: 'smooth' });
        event.preventDefault();
        break;
      case 'End':
        box?.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
        event.preventDefault();
        break;
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }
  // ---- End of Gallery popup ----

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(deltaX) < 40) return;
    deltaX < 0 ? this.nextProject() : this.prevProject();
  }

  getSlideStyle(index: number): Record<string, string> {
    const offset = this.slideOffset(index);
    const distance = Math.abs(offset);

    const scale = [1, 0.82, 0.66][Math.min(distance, 2)];
    const opacity = [1, 0.55, 0.25, 0][Math.min(distance, 3)];
    const rotate = offset === 0 ? 0 : offset > 0 ? -22 : 22;

    return {
      transform: `translateX(calc(-50% + ${offset} * var(--step))) scale(${scale}) rotateY(${rotate}deg)`,
      opacity: String(opacity),
      zIndex: String(10 - distance),
      pointerEvents: distance > 2 ? 'none' : 'auto',
      ...(this.jumping.has(index) ? { transition: 'none' } : {})
    };
  }

  downloadResume(): void {
    const link = document.createElement('a');
      link.href = 'assets/files/Rupert_Kent_Navo_Resume.pdf';
      link.download = 'Rupert_Kent_Navo_Resume.pdf';
      link.click();
  }

  goToContact(): void {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  goToProjects(): void {
    document.getElementById('projects')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  getMailto(): string {
    return `mailto:${this.email}`;
  }

  getSkillIcon(skill: string): string {
    return this.skillIcons[skill] ?? 'devicon-devicon-plain';
  }

  isImageIcon(icon: string): boolean {
    return icon.startsWith('assets/') || icon.startsWith('http') || icon.includes('.');
  }

  getTechIcon(tech: string): string {
  return this.skillIcons[tech] ?? 'devicon-devicon-plain';
  }


  // ---- Contact ----
    contact = { name: '', email: '', message: '' };
    submitted = false;
    sending = false;
    sent = false;
    sendError = false;

    socials = [
      { name: 'LinkedIn', handle: 'Rupert Kent Navo', url: 'https://www.linkedin.com/in/rupert-kent-navo-212897271', icon: 'devicon-linkedin-plain' },
    ];

    async sendMessage(form: NgForm): Promise<void> {
      this.submitted = true;
      this.sent = false;
      this.sendError = false;
      if (form.invalid) return;

      this.sending = true;

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: '52c1d873-4e30-487f-93f2-fb7a3dd1e3b6',
            subject: `Portfolio message from ${this.contact.name}`,
            from_name: 'Portfolio Website - Rupert',
            name: this.contact.name,
            email: this.contact.email,
            message: this.contact.message
          })
        });

        const result = await response.json();

        if (result.success) {
          this.sent = true;
          this.submitted = false;
          form.resetForm();
        } else {
          this.sendError = true;
        }
      } catch {
        this.sendError = true;
      } finally {
        this.sending = false;
      }
    }
  // ---- End Contact ----
}


