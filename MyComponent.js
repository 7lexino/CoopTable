class CoopTable {
    constructor(id, settings){
        this.defaultOptions = {
            pageLength: 5
        }
        
        this.queryType = settings.query.type;
        this.queryPageLength = settings.query.pageLength;
        this.id = id;
        this.settings = settings;
        
        this.data;
        this.columns = settings.columns;

        this.eTable = document.getElementById(this.id);
        this.currentPage = 1;
        this.eDivPaginator;

        if(false == this.ValidateTable()){
            
        }else{
            this.CreateTable();
        }
    }

    ValidateTable(){
        return true;
    }

    RenderTable(){
        this.RenderBody();
        this.DrawBody();
    }

    async CreateTable(){
        if(this.queryType == "array"){
            this.data = this.settings.query[this.queryType];
        }else if(this.queryType == "url"){
            let url = this.settings.query[this.queryType];
        
            await fetch(url, {
                method: "GET"
            })
            .then(res => res.json())
            .then( response => {
                this.data = response.data;
            })
            .catch(error => console.log(error));
            
            this.RenderTable();
        }
    }

    CreatePagination(){
        var ele = document.getElementById("controles");
        
        ele.innerHTML = '<div id="ct-paginator">'+
            '<button id="cp-btn-prev" onclick="table1.PrevPage()" class="btn btn-secondary">Prev</button>'+
            '<button id="cp-btn-next" onclick="table1.NextPage()" class="btn btn-secondary">Next</button></div>';
    }

    GetComponents(){
        
    }

    

    RenderBody(){
        // let strRows = '';
        // for(let y = 0; y < this.queryPageLength; y++){
        //     let strColumns = '';
        //     for(let x = 0; x < this.columns.length; x++){
        //         if(true == this.columns[x].visible){
        //             strColumns += '<td>' + this.data[y][this.columns[x].data] + '</td>';
        //         }else{
        //             strColumns += '<td class="d-none">' + this.data[y][this.columns[x].data] + '</td>';
        //             this.eTable.tHead.children[0].children[x].classList.add("d-none");
        //         }
        //     }
        //     strRows += '<tr>' + strColumns + '</tr>';
        // }
        // return strRows;

        return ;
    }

    

    DrawBody(){
        this.eTable.tBodies[0].innerHTML = this.ChangePage(this.currentPage);
    }

    CreateRow(){
        
    }

    NumPages(){
        //console.log(this.data.length);
        return Math.ceil(this.data.length / this.queryPageLength);
    }

    ChangePage(page){
        this.CreatePagination();
        let btn_prev = document.getElementById("cp-btn-prev");
        let btn_next = document.getElementById("cp-btn-next");
        var strRows = '';
        //let page_span = document.getElementById("page");
    
        // Validate page
        if (page < 1) page = 1;
        if (page > this.NumPages()) page = this.NumPages();

        for (let y = (page-1) * this.queryPageLength; y < (page * this.queryPageLength); y++) {
            let strColumns = '';
            for(let x = 0; x < this.columns.length; x++){
                if(true == this.columns[x].visible){
                    strColumns += '<td>' + this.data[y][this.columns[x].data] + '</td>';
                }else{
                    strColumns += '<td class="d-none">' + this.data[y][this.columns[x].data] + '</td>';
                    this.eTable.tHead.children[0].children[x].classList.add("d-none");
                }
            }
            strRows += '<tr>' + strColumns + '</tr>';
        }
        if (page == 1) {
            btn_prev.style.visibility = "hidden";
        } else {
            btn_prev.style.visibility = "visible";
        }

        if (page == this.NumPages()) {
            btn_next.style.visibility = "hidden";
        } else {
            btn_next.style.visibility = "visible";
        }
        
        return strRows;

    }

    PrevPage()
    {
        if (this.currentPage > 1) {
            this.currentPage--;
            console.log(this.currentPage);
            this.ChangePage(this.currentPage);
            this.DrawBody();
        }
    }

    NextPage()
    {
        if (this.currentPage < this.NumPages()) {
            this.currentPage++;
            this.ChangePage(this.currentPage);
            this.DrawBody();
        }
    }


}