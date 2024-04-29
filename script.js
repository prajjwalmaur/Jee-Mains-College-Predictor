function show(arr) {
    let result = document.getElementsByClassName("result")[0];
    arr.forEach(i => {
        let infor = document.createElement("div");
        infor.setAttribute("class", "inform");
        infor.innerHTML = `<p><b>Institute Name : </b> ${i.fields.Institute}.</p><p><b>Academic Program Name : </b> ${i.fields.ProgramName}.</p><p><b>Quota : </b> ${i.fields.Quota.toUpperCase()}.</p><p><b>Closing Rank : </b> ${i.fields.Rank}</p>`;
        result.appendChild(infor);
    });
}

function submit() {
    let submit = document.getElementById("submit");
    submit.innerText = "ReSubmit";
    let result = document.getElementsByClassName("result")[0];
    result.innerHTML = "";
    let pleasewait = document.getElementById("pleasewait");
    pleasewait.style.display = "flex";
    pleasewait.innerHTML = `Please Wait <div id="pleasetime"></div>`;
    const apiKey = 'patvyameLuNI31duT.251ae25f4ed5e3522c95a9dae75f8282935c7d1f22aee86200b890aaf319ab14';
    const baseId = 'appUGuoZwlXD9Hlp4';
    const tableName = 'rankTable';
    let rank = document.getElementById("rank").value;
    let caste = document.getElementById("category").value;
    let program = document.getElementById("program").value;
    let state = document.getElementById("state").value;
    let gender = document.getElementById("gender").value;
    var filterByFormula;
    if (program == "all") {
        filterByFormula = `AND(Rank >= '${rank.toString()}', Category = '${caste}',Gender = "${gender}", OR( Quota = "os",Quota = "ai", AND( Quota = "hs" , HomeState = "${state}") ))`;
    }
    else if (program == "Comput") {
        filterByFormula = `AND(OR(FIND("${program}", {ProgramName}) > 0,FIND("Data", {ProgramName}) > 0,FIND("IT", {ProgramName}) > 0,FIND("Artificial", {ProgramName}) > 0),Rank >= '${rank.toString()}', Category = '${caste}',Gender = "${gender}",OR( Quota = "os",Quota = "ai", AND( Quota = "hs" , HomeState = "${state}") ))`;
    }
    else {
        filterByFormula = `AND(FIND("${program}", {ProgramName}) > 0,Rank >= '${rank.toString()}', Category = '${caste}',Gender = "${gender}", OR( Quota = "os",Quota = "ai", AND( Quota = "hs" , HomeState = "${state}") ))`;
    }

    var arr;
    const recordsPerPage = 100;

    async function fetchRecords(offset) {
        const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodeURIComponent(filterByFormula)}&limit=${recordsPerPage}&offset=${offset}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        const data = await response.json();
        return data;
    }

    async function fetchAllRecords() {
        let allRecords = [];
        let offset = '';

        do {
            const response = await fetchRecords(offset);
            if (response.records && response.records.length > 0) {
                allRecords = allRecords.concat(response.records);
            }

            offset = response.offset;
        } while (offset);

        return allRecords;
    }

    fetchAllRecords()
        .then(records => {
            arr = records;
            let len = arr.length;
            if (len == 0){
                clearInterval(t1);
                pleasewait.innerText = "Sorry No College Found !!!";
                return;
            }
            arr.sort((a, b) => {
                return a.fields.Rank - b.fields.Rank;
            });
            pleasewait.innerText = `Congratulations Total ${len} College Found 👍`;
            show(arr);
        })
        .catch(error => {
            console.error('Error fetching records:', error);
        });
}


function slidebar() {
    let header = document.getElementsByClassName("header")[0];
    header.style.flexDirection = "column";
    let navbar = document.getElementsByClassName("navbar")[0];
    navbar.style.display = "block";
    let nav = document.getElementById("nav");
    nav.style.display = "flex";
    nav.style.flexDirection = "column";
    nav.style.width = "100%";
    let slidebar = document.getElementById("slidebar");
    slidebar.style.display = "none";
    let reload = document.getElementById("reload");
    reload.style.display = "block";
}

function reload() {
    location.reload();
}