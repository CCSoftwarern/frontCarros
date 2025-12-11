import { Component, signal, TemplateRef, WritableSignal, inject, } from '@angular/core';
import { OnInit } from '../../../../node_modules/@angular/core/index';
import { Carro } from '../../interface/carro';
import { ServiceCarroService } from '../../services/service-carro.service';
import { DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listacarros',
  standalone: true,
  imports: [DecimalPipe, FormsModule, ReactiveFormsModule,ToastrModule ],
  templateUrl: './listacarros.component.html',
  styleUrl: './listacarros.component.css'
})
export class ListacarrosComponent implements OnInit {

  carros: Carro[] = [];
  isloadingSalvar: boolean = false;
  isEdicao: boolean = false;
  idCarroEditar: number | null = null;
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
  constructor(private servico: ServiceCarroService, private toastr: ToastrService) {

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
        this.toastr.success('Lista de carros atualizada com sucesso!', 'Sucesso',{ timeOut: 2000, progressBar: true,positionClass: 'toast-bottom-right' } );
      }
    })
  }

  reloadPage() {
    window.location.reload();
  }

  onDeleteCarro(nmModelo: string): void {
    this.servico.deleteCarro(nmModelo).subscribe({
      next: () => {
         this.toastr.info('Carro excluído', 'Excluido',{ timeOut: 2000, progressBar: true,positionClass: 'toast-bottom-right' } );
        this.onGetCarros()
      }
      , error: (err) => {
        this.onGetCarros()
        console.error('Erro:', err)
      },

    });
  }

  onImageError(event: any) {
    event.target.src = 'assets/carros/noImage.jpeg'; // imagem padrão
  }

  onSaveCarro(): void {
    const carro: Carro = {
      id: this.idCarroEditar!=null ? this.carroForm.value.id : 0,
      modelo: this.carroForm.value.modelo,
      preco: this.carroForm.value.preco,
      urlimagem: this.carroForm.value.urlimagem,
    };
    if (this.isEdicao) {
      this.oneditarCarro(carro, this.idCarroEditar!);
      return;
    }
    this.servico.saveCarro(carro).subscribe({
      next: (dados) => {
        this.toastr.success('Carro salvo com sucesso!', 'Salvo',{ timeOut: 2000, progressBar: true,positionClass: 'toast-bottom-right' } );
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
     this.carroForm.reset();// Limpa o formulário ao abrir o modal
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult.set(`Closed with: ${result}`);
      },
      (reason) => {
        this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
      },
    );
  }

  openModalEditar(content: any, carro: any) {
    this.carroForm.patchValue({
      modelo: carro.modelo,
      preco: carro.preco,
      urlimagem: carro.urlimagem
    });

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
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

  oneditarCarro(carro: Carro, idCarro:number): void {
    this.servico.editarCarro(carro, idCarro).subscribe({
      next: (dados) => {
        this.toastr.success('Carro editado com sucesso!', 'Sucesso',{ timeOut: 2000, progressBar: true,positionClass: 'toast-bottom-right' } );
        this.onGetCarros();
        this.isEdicao = false;
        this.modalService.dismissAll();
        console.log(dados);
      },
      error: (erro) => {
        console.error(erro);
      }
    });
  }

}
