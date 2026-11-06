import { Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { PublicationCarrouselComponent } from '../../components/publication-carrousel/publication-carrousel.component';
import { ExpressCarouselComponent } from '../../components/express-carousel/express-carousel.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { SellerCtaComponent } from '../../components/seller-cta/seller-cta.component';
import { FeaturesComponent } from '../../components/features/features.component';
import { TestimonialsComponent } from '../../components/testimonials/testimonials.component';



@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    FeaturesComponent,
    PublicationCarrouselComponent,
    ExpressCarouselComponent,
    TestimonialsComponent,
    SellerCtaComponent,
    FaqComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
