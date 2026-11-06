import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  heroArchiveBoxArrowDownSolid,
  heroShieldCheckSolid,
  heroLockClosedSolid
} from '@ng-icons/heroicons/solid';


@Component({
  selector: 'seller-cta',
  imports: [NgIcon],
    providers: [
      provideIcons({ 
        heroArchiveBoxArrowDownSolid , 
        heroShieldCheckSolid,
        heroLockClosedSolid
      })
    ],
  templateUrl: './seller-cta.component.html',
  styleUrl: './seller-cta.component.css'
})
export class SellerCtaComponent {

}
