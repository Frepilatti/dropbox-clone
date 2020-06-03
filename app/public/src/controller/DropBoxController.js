class DropBoxController {

    constructor(){

        this.btnSendFieldEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');
        this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
        this.fileNameEl = this.snackModalEl.querySelector('.filename');
        this.timeLeftEl = this.snackModalEl.querySelector('.timeleft');

        this.initEvent();
    }

    initEvent(){
        // When the user cicks the "Enviar Arquivos" button, the window to attach a file will open and forces the user to click on it
        this.btnSendFieldEl.addEventListener('click', event=>{

            this.inputFilesEl.click();

        });

        this.inputFilesEl.addEventListener('change', event=>{

            this.uploadTask(event.target.files);

            this.showModal();

            this.inputFilesEl.value = '';

        });

    }//Closing initEvent

    showModal(show = true){
        //Once the user selected wich file to upload the react-snackbar-root will be displayed
        this.snackModalEl.style.display = (show) ? 'block' : 'none';

    }//Closing show modal



    uploadTask(files) {

        let promises = [];

        //files is a collection thet we need to convert into an array by doing [...files], we use the ... because we don´t know how many files we have and we need to creat an array with all of them
        //For each file we have we need to push its promise into the array promises
        [...files].forEach(file=>{

            promises.push(new Promise((resolve, reject)=>{

                //Now for each promise we will make our async request
                let ajax = new XMLHttpRequest();
                //We open our connection via post and send it to the upload directory
                ajax.open('POST', '/upload');
                //To know when it finishes sending the ajax we use ajax.onload and we use try catch to know if it was succesfully done or not
                ajax.onload = evnet => {

                    this.showModal(false);

                    try{
                        //We try to resolve the response from our server using JSON.parse
                        resolve(JSON.parse(ajax.responseText));
                    } catch(e) {
                        //If the JSON wasn't valid we send the response reject
                        reject(e);
                    }

                };
                //We also have ajax.onerror if the onload wasn't executed
                ajax.onerror = event=>{

                    this.showModal(false);
                    reject(event);

                };
                // Make the progress-bar on the react-snackbar-root move acording to the progress of the upload
                ajax.upload.onprogress = event =>{

                    this.uploadProgress(event, file);
                }
               
                //We instantiate the API FormData 
                let formData = new FormData();
                
                //Then we need to put the file we receive using forEach inside the formData
                //First parameter is the name of the field the server will receive and the second is the file we are sending
                formData.append('input-file', file);
                
                //Get time the user started the upload(used to calculate the time left upload)
                this.startUploadTime = Date.now();
                
                //Then we need to send the formData using send
                ajax.send(formData);

            }));

        });

        //Promise.all recives an array of promises
        //It verifys everytihng and executes each of the resolves we have
        return Promise.all(promises);

    }//Closing uploadTask

    uploadProgress(event, file){

        let timespent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let percent = parseInt((loaded / total) * 100);
        let timeleft = ((100 - percent) * timespent) / percent;

        this.progressBarEl.style.width = `${percent}%`;

        this.fileNameEl.innerHTML = file.name;
        this.timeLeftEl.innerHTML = this.formatTimeLeft(timeleft);

        console.log(timespent, timeleft, percent);

    }//Closing uploadProgress

    formatTimeLeft(duration){

        let second = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (100 * 60 * 60 )) % 24);

        if (hours > 0 ){
            return `${hours} hours, ${minutes} minutes and ${second} seconds`
        }

        if (minutes > 0 ){
            return `${minutes} minutes and ${second} seconds`
        }

        if (second > 0 ){
            return `${second} seconds`
        }

        return '';
    }//Closing formatTimeLeft

}//End of class DropBoxController