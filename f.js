
/// CAMPOS DE SUBREDES
const container = document.getElementById("contenedorCampos");
cantidad = document.getElementById("noSubredes");

cantidad.addEventListener("input", actualizarCampos);

function actualizarCampos(){
    cantidad = document.getElementById("noSubredes").value;
    let html = "";
    for (let i = 1; i <= cantidad; i++) {
        html += `
        <label for="campo${i}" class="form-label">Subred ${i}:</label>
        <input type="text" class= "form-control w-50"name="campo${i}" id="campo${i}" required><br>
        `;
    }
    container.innerHTML = html;
}
///


document.getElementById("boton").addEventListener("click", ejecutarIP);

function ipToInt(ip) {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

function intToIp(int) {
    return [
        (int >> 24) & 255,
        (int >> 16) & 255,
        (int >> 8) & 255,
        int & 255
    ].join('.');
}

function imprimir(ipRed, i, hosts, bits, mascara, primerHost, ultimoHost, broadcast){
    let html;
    html = 
    `<tr>
        <td>Subred ${i}</td>
        <td>${hosts}</td>
        <td>${ipRed}/${bits}</td>
        <td>${mascara}</td>
        <td>${primerHost}</td>
        <td>${ultimoHost}</td>
        <td>${broadcast}</td>
    </tr>`;
    return html;
}

function ejecutarIP(){
    let direccionIp = document.getElementById("ip").value;

    const n = cantidad;
    let tam = new Array(n);
    for(let i = 1; i <= n; ++i){
        tam[i - 1] = parseInt(document.getElementById(`campo${i}`).value);
    }
    tam.sort((a, b) => b - a);

    let pInicial = document.getElementById("bits").value;

    /// inicializamos la tabla
    const container = document.getElementById("tablaDeSubredes");
    let html = `
    <div id="tablaDeSubredes" class="mt-5">
        <h2 class="mb-3" style="color: #6f42c1;">Tabla de Subredes</h2>
        <div class="table-responsive">
            <table class="table table-bordered table-striped align-middle text-center borde-morado">
                <thead class="table-success">
                    <tr>
                        <th>Subred</th>
                        <th>Hosts</th>
                        <th>Dirección</th>
                        <th>Máscara</th>
                        <th>Primer Host</th>
                        <th>Último Host</th>
                        <th>Broadcast</th>
                    </tr>
                </thead>
                <tbody>
    `;

    ///

    for(let i = 0; i < n; ++i){
        let valPot = 1;
        let potN = 0;
        /// el + 2 es por la ip de subred y el broadcast
        while(valPot < parseInt(tam[i]) + parseInt(2)){
            valPot*=2;
            potN++;
        }
        let r = 32 - parseInt(pInicial) - parseInt(potN);
        let p = parseInt(pInicial) + parseInt(r);
        // aca ya tengo la primera potencia que es mayor o igual
        let ipInicial = ipToInt(direccionIp);
        let ipFinal = parseInt(ipInicial) + parseInt(valPot);

        let broadcast = intToIp(parseInt(ipInicial) + parseInt(valPot) - 1);
        let ultimoHost = intToIp(parseInt(ipInicial) + parseInt(valPot) - 2);
        let primerHost = intToIp(parseInt(ipInicial) + 1);

        let mascara = 0, pase = 0;
        for(let j = 31; j >= 0; --j){
            mascara = parseInt(mascara) + parseInt(1 << j);
            pase++;
            if(pase == p) break;
        }

        mascara = intToIp(parseInt(mascara));

        /// mandamos a imprimir la nueva fila de la tabla
        html+= imprimir(direccionIp, i + 1, valPot - 2, p, mascara, primerHost, ultimoHost, broadcast);

        direccionIp = intToIp(ipFinal);
        
    }
    /// asignamos la tabla de subredes
    html += `
                </tbody>
            </table>
        </div>
    </div>
    `;
    container.innerHTML = html;
    ///
}

