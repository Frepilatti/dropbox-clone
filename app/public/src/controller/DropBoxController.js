class DropBoxController {

    constructor(){

        this.btnSendFieldEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');

        this.initEvent();
    }

    initEvent(){
        // When the user cicks the "Enviar Arquivos" button the window to attach a file will open and forces the user to click it
        this.btnSendFieldEl.addEventListener('click', event=>{

            this.inputFilesEl.click();

        });
        //Once the user selected wich file to upload the react-snackbar-root will be displayed
        this.inputFilesEl.addEventListener('change', event=>{

            this.snackModalEl.style.display = 'block';

        });

    }

}