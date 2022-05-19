var CoopTable = {
    queryType: "",
    queryPageLength: 10,
    id: 0,
    data: [],
    eTable: null,
    currentPage: 1,
    eDivPaginator: null,
    numPages: 0,
    settings: {
        query: {
            type: "",
            array: [],
            url: "",
            pageLength: 10
        },
        columns: []
    },
    columnsData: [],
    Init: function (id, settings) {
        this.settings = settings;
        this.queryType = this.settings.query.type;
        this.queryPageLength = this.settings.query.pageLength;
        this.id = id;
        this.eTable = document.getElementById(id);
        this.eTable.tBodies[0].innerHTML = 'Cargando...';

        if(false == this.ValidateTable()){
            
        }else{
            this.CreateTable();
        }

        
    },
    ValidateTable: function () {
        return true;
    },
    RenderTable: function () {
        this.CreateColumnControls();
        this.CreateHeader();
        this.GenerateFooter();
        this.eTable.tBodies[0].innerHTML = this.ChangePage(1);
    },
    GetData: function () {
        
    },
    CreateTable: async function () {
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
            
        }
        
        if(this.data.length == 0){

        }else{
            this.numPages = Math.ceil(this.data.length / this.queryPageLength);
            for(let prop in this.data[0]){
                this.columnsData.push(prop);
            }
            //console.log(this.columnsData);
            this.RenderTable();
        }
    },
    CreateColumnControls(){
        let headerColumns = this.eTable.tHead.children[0].children;
        for(let i=0; i < headerColumns.length; i++){
            //console.log(headerColumns[i]);
            //headerColumns[i].classList.add("");

            headerColumns[i].innerHTML = `
            <div class="row" id="ct-table-th-${i}">
                <div style="width:80%;">${headerColumns[i].innerHTML}</div>
                <div style="width:20%;" class="d-flex justify-content-end">
                    <input id="ct-table-sort-icon-${i}" type="checkbox" class="btn-check" onclick="CoopTable.SortColumn(${i})" />
                    <label for="ct-table-sort-icon-${i}" class="btn btn-sm"><i class="fa-solid fa-sort text-muted"></i></label>
                </div>
            </div>`;
        }
    },
    SortColumn: function(col) {
        let eInputBtnSort = document.getElementById("ct-table-sort-icon-" + col);

        this.data = this.data.sort( function (a, b) {
            let valueA = a[self.CoopTable.columnsData[`${col}`]];
            let valueB = b[self.CoopTable.columnsData[`${col}`]];

            if(valueA == valueB) return 0;
            else if(valueA > valueB) return eInputBtnSort.checked ? 1 : -1;
            else return eInputBtnSort.checked ? -1 : 1;
        });
        this.eTable.tBodies[0].innerHTML = this.ChangePage(this.currentPage);

        if (eInputBtnSort.checked){
            eInputBtnSort.nextElementSibling.innerHTML = '<i class="fa-solid fa-sort-up"></i>';
        }else{
            eInputBtnSort.nextElementSibling.innerHTML = '<i class="fa-solid fa-sort-down"></i>';
        }
    },
    CreateHeader: function () {
        let eDivHeader = document.createElement("div");
        eDivHeader.setAttribute("class", "mb-2");

        // Create select
        let eSelect = document.createElement("select");
        eSelect.setAttribute("id", "ct-showed-records");
        eSelect.setAttribute("onchange", "CoopTable.UpdateShowedRecords()");
        //eSelect.append('<option value=""></option>')
        
        eSelect.innerHTML = ''+
            '<option value="10">'+this.queryPageLength+'</option>' +
            '<option value="25">25</option>' +
            '<option value="50">50</option>' +
            '<option value="100">100</option>';
        

        eDivHeader.append("Mostrar ");
        eDivHeader.append(eSelect);
        eDivHeader.append(" registros");
        this.eTable.parentNode.insertBefore(eDivHeader, this.eTable);
    },
    UpdateShowedRecords: function () {
        let eSelectShowedRecords = document.getElementById("ct-showed-records");
        this.queryPageLength = eSelectShowedRecords.value;
        this.numPages = Math.ceil(this.data.length / this.queryPageLength);
        this.eTable.tBodies[0].innerHTML = this.ChangePage(1);
        this.GenerateFooter();
    },
    GenerateFooter: function () {
        //numPages = this.NumPages();
        this.eTable.nextElementSibling.innerHTML = "";

        let eDivPaginator = document.createElement("div");
        eDivPaginator.setAttribute("class", "btn-group");
        //eDivPaginator.setAttribute("role", "group");

        eDivPaginator.innerHTML = ''+
            '<button type="button" id="cp-btn-prev" onclick="CoopTable.PrevPage()" class="btn btn-light border">Prev</button>'+
            '<button type="button" id="cp-btn-next" onclick="CoopTable.NextPage()" class="btn btn-light border">Next</button>';
        this.eTable.parentNode.insertBefore(eDivPaginator, this.eTable.nextElementSibling);
        
        let btn_prev = document.getElementById("cp-btn-prev");
        let btn_next = document.getElementById("cp-btn-next");

        // Generate all numbers pages buttons
        for(let i = this.numPages; i >= 1; i--){
            let eInputNumPage = document.createElement("input");
            eInputNumPage.setAttribute("type", "radio");
            eInputNumPage.setAttribute("class", "btn-check")
            eInputNumPage.setAttribute("name", "ct-radio-paginator");
            eInputNumPage.setAttribute("id", `ct-btn-page-${i}`);
            eInputNumPage.setAttribute("onclick", `CoopTable.SetPage(${i})`);

            let eLabelNumPage = document.createElement("label");
            eLabelNumPage.setAttribute("class", "btn btn-outline-light text-black border");
            eLabelNumPage.setAttribute("for", `ct-btn-page-${i}`);
            eLabelNumPage.innerHTML = i;

            btn_prev.parentNode.insertBefore(eLabelNumPage, btn_prev.nextElementSibling)
            btn_prev.parentNode.insertBefore(eInputNumPage, btn_prev.nextElementSibling)
        }
    },
    GetComponents: function () {
        
    },
    RenderBody: function () {
        return ;
    },
    CreateRow: function () {
        
    },
    ChangePage: function (page) {
        let strRows = "";

        // Validate page
        if (page < 1) page = 1;
        if (page > this.numPages) page = this.numPages;

        for (let y = (page-1) * this.queryPageLength; y < (page * this.queryPageLength) && y < this.data.length; y++) {
            let strColumns = '';
            for(let x = 0; x < this.settings.columns.length; x++){
                if(true == this.settings.columns[x].visible){
                    strColumns += '<td>' + this.data[y][this.settings.columns[x].data] + '</td>';
                }else{
                    strColumns += '<td class="d-none">' + this.data[y][this.settings.columns[x].data] + '</td>';
                    this.eTable.tHead.children[0].children[x].classList.add("d-none");
                }
            }
            strRows += '<tr>' + strColumns + '</tr>';
        }
        
        return strRows;
    },
    SetPage: function (page) {
        //let eButtonPage = document.getElementById("ct-btn-page-" + page);
        //eButtonPage.classList.add("active");
        this.currentPage = page;
        this.eTable.tBodies[0].innerHTML = this.ChangePage(page);
    },
    PrevPage: function () {
        if (this.currentPage > 1) {
            this.SetPage(this.currentPage - 1);
        }
    },
    NextPage: function () {
        if (this.currentPage < this.numPages) {
            this.SetPage(this.currentPage + 1);
        }
    }

}