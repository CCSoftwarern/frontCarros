import { Component, signal, TemplateRef, WritableSignal, inject, } from '@angular/core';
import { OnInit } from '../../../../node_modules/@angular/core/index';
import { Carro } from '../../interface/carro';
import { ServiceCarroService } from '../../services/service-carro.service';
import { DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-listacarros',
  standalone: true,
  imports: [DecimalPipe,  FormsModule, ReactiveFormsModule],
  templateUrl: './listacarros.component.html',
  styleUrl: './listacarros.component.css'
})
export class ListacarrosComponent implements OnInit {

  carros: Carro[] = [];
  isloadingSalvar: boolean = false;
  // listaCarrosExemplo: Carro[] = [
  //   { id: 1, modelo: 'Modelo A', marca: 'Marca X', ano: 2020, preco: 50000, imagem: './assets/carros/1.jpeg' },
  //   { id: 2, modelo: 'Modelo B', marca: 'Marca Y', ano: 2019, preco: 40000, imagem: './assets/carros/2.jpeg' },
  //   { id: 3, modelo: 'Modelo C', marca: 'Marca Z', ano: 2021, preco: 60000 , imagem: './assets/carros/3.jpeg'},
  // { id: 4, modelo: 'Modelo C', marca: 'Marca Z', ano: 2021, preco: 60000 , imagem: './assets/carros/3.jpeg'},
  // { id: 5, modelo: 'Modelo C', marca: 'Marca Z', ano: 2021, preco: 60000 , imagem: './assets/carros/3.jpeg'},
  // { id: 6, modelo: 'Modelo C', marca: 'Marca Z', ano: 2021, preco: 60000 , imagem: './assets/carros/3.jpeg'},
  // { id: 7, modelo: 'Modelo C', marca: 'Marca Z', ano: 2021, preco: 60000 , imagem: './assets/carros/3.jpeg'},
  // ];
  carroForm: FormGroup = new FormGroup({
    modelo: new FormControl('', [Validators.required]),
    preco: new FormControl('', [Validators.required]),
    urlimagem: new FormControl('', [Validators.required]),
  });
  
  private modalService = inject(NgbModal);
	closeResult: WritableSignal<string> = signal('');
  constructor(private servico: ServiceCarroService){

  }
  ngOnInit(): void {
    this.onGetCarros()
  }

  onGetCarros(): void {
    this.servico.getCarros().subscribe({
      next: (dados) => {
        this.carros = dados;
        console.log(dados);

      },
      error: (erro) => {
        console.log(erro);
      },
      complete: () => {
        console.log('Chamada finalizada');
      }
    })
  }

  reloadPage() {
    window.location.reload();
  }

  onDeleteCarro(id: number): void {
    this.servico.deleteCarro(id).subscribe({
      next: () => {
        alert('Carro excluído com sucesso!')
        this.onGetCarros()
      }
,      error: (err) => {
    this.onGetCarros()
  console.error('Erro:', err)},

    });
  }

  onImageError(event: any) {
  event.target.src = 'assets/carros/noImage.jpeg'; // imagem padrão
}

onSaveCarro(): void {
  const carro: Carro = {
    id: 0,
    modelo: this.carroForm.value.modelo,
    preco: this.carroForm.value.preco,
    urlimagem: this.carroForm.value.urlimagem,
  };

  this.servico.saveCarro(carro).subscribe({
    next: (dados) => {
      alert('Carro salvo com sucesso!');
      this.modalService.dismissAll();
      this.onGetCarros();
      console.log(dados);
    },
    error: (erro) => {
      console.error(erro);
    }
  });
}



  open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult.set(`Closed with: ${result}`);
			},
			(reason) => {
				this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
			},
		);
	}

	private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

}
