document.getElementById("boton").addEventListener("click", calcularCIDR);

// ===============================
// Conversión IP <-> Entero
// ===============================
function ipToInt(ip) {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
}

function intToIp(int) {
    return [
        (int >>> 24) & 255,
        (int >>> 16) & 255,
        (int >>> 8) & 255,
        int & 255
    ].join('.');
}

// ===============================
// Cálculo CIDR
// ===============================
function calcularCIDR() {
    const ip = document.getElementById("ip").value.trim();
    const prefijo = parseInt(document.getElementById("bits").value);

    if (prefijo < 0 || prefijo > 32) {
        alert("Prefijo inválido (0–32)");
        return;
    }

    const ipInt = ipToInt(ip);
    const hostBits = 32 - prefijo;

    const totalHosts = hostBits >= 2 ? (2 ** hostBits - 2) : 0;
    const salto = 2 ** hostBits;

    const mascaraInt = (0xFFFFFFFF << hostBits) >>> 0;
    const mascara = intToIp(mascaraInt);

    const ipRedInt = ipInt & mascaraInt;

    const ipRed = intToIp(ipRedInt);
    const broadcast = intToIp(ipRedInt + salto - 1);
    const primerHost = hostBits >= 2 ? intToIp(ipRedInt + 1) : "N/A";
    const ultimoHost = hostBits >= 2 ? intToIp(ipRedInt + salto - 2) : "N/A";

    imprimirTabla(ipRed, prefijo, mascara, totalHosts, primerHost, ultimoHost, broadcast);
}

// ===============================
// Salida HTML
// ===============================
function imprimirTabla(red, prefijo, mascara, hosts, primer, ultimo, broadcast) {
    document.getElementById("tablaDeSubredes").innerHTML = `
    <div class="table-responsive mt-4">
        <table class="table table-bordered table-striped text-center">
            <thead class="table-success">
                <tr>
                    <th>Red</th>
                    <th>CIDR</th>
                    <th>Máscara</th>
                    <th>Hosts</th>
                    <th>Primer Host</th>
                    <th>Último Host</th>
                    <th>Broadcast</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${red}</td>
                    <td>/${prefijo}</td>
                    <td>${mascara}</td>
                    <td>${hosts}</td>
                    <td>${primer}</td>
                    <td>${ultimo}</td>
                    <td>${broadcast}</td>
                </tr>
            </tbody>
        </table>
    </div>`;
}
