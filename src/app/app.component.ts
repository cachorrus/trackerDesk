import { takeWhile } from 'rxjs/operators';
import { Component, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  title = 'Tracker taxistas';
  lat = 51.678418;
  lng = 7.809007;
  taxistas: Taxista[];
  init = false;
  private alive = true;

  siguiendoNombre: string = null;

  constructor( private afDB: AngularFirestore ) {

    this.afDB.collection('usuarios')
             .valueChanges()
             .pipe(
                takeWhile( () => this.alive )
              )
             .subscribe( (data: Taxista[]) => {

              this.taxistas = data;

              if ( !this.init ) {
                this.lat = data[0].lat;
                this.lng = data[0].lng;
                this.init = true;
              }

              if ( this.siguiendoNombre ) {

                data.forEach( taxista => {

                  if ( taxista.nombre === this.siguiendoNombre ) {

                    this.lat = taxista.lat;
                    this.lng = taxista.lng;

                  }

                });

              }

             }) ;

  }

  public ngOnDestroy() {
    this.alive = false;
    console.log('Destroy');
  }

  seguir( taxista: Taxista ) {

    console.log(taxista);
    this.siguiendoNombre = taxista.nombre;

    this.lat = taxista.lat;
    this.lng = taxista.lng;

  }

  dejarDeSeguir() {

    this.siguiendoNombre = null;

  }

}

interface Taxista {
  nombre: string;
  clave: string;
  lat: number;
  lng: number;
}
