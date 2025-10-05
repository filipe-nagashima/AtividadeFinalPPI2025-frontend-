
const formulario = document.getElementById("formCliente")

formulario.onsubmit = gravarCliente

document.getElementById('btnAlterar').addEventListener('click', alterarCliente);
document.getElementById('btnCancelar').addEventListener('click', () => {
    prepararTela('','','','','cancelar');
});

exibirTabelaClientes()

function gravarCliente(evento) {
    if (validarFormulario()) {
        const cpf = document.getElementById("cpf").value
        const nome = document.getElementById("nome").value
        const tel = document.getElementById("tel").value
        const email = document.getElementById("email").value

        fetch("http://localhost:4000/cliente", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "cpf": cpf,
                "nome": nome,
                "telefone": tel,
                "email": email
            })

        })
            .then((resposta) => { return resposta.json() })
            .then((dados) => {
                if (dados.status) {
                    alert("Cliente cadastrado com sucesso!")
                    formulario.reset()
                    exibirTabelaClientes()
                }
                else {
                    alert(dados.mensagem)
                }
            })
            .catch((erro) => {
                alert("Não foi possível gravar o cliente:" + erro.message)
            })

    }
    evento.stopPropagation()
    evento.preventDefault()
}

function validarFormulario() {

    const formValidado = formulario.checkValidity()

    if (formValidado) {
        formulario.classList.remove("was-validated")
    }
    else {
        formulario.classList.add("was-validated")
    }

    return formValidado
}

function excluirCliente(cpf) {
    if (confirm("Deseja excluir o cliente?")) {
        fetch("http://localhost:4000/cliente/" + cpf, { method: "DELETE" })
            .then((resposta) => {
                if (resposta.ok) {
                    return resposta.json()
                }
            })
            .then((dados) => {
                if (dados.status) {
                    exibirTabelaClientes()
                }
                alert(dados.mensagem)
            })
            .catch((erro) => {
                alert("Não foi possível excluir o cliente:" + erro.message)
            })

    }
}

function alterarCliente() {
    let btnCadastrar = document.getElementById("btnCadastrar")
    let btnAlterar = document.getElementById("btnAlterar")
    let btnCancelar = document.getElementById("btnCancelar")

    if (confirm("Deseja alterar o cliente?")) {
        if (validarFormulario()) {
            const cpf = document.getElementById("cpf").value
            const nome = document.getElementById("nome").value
            const tel = document.getElementById("tel").value
            const email = document.getElementById("email").value

            fetch("http://localhost:4000/cliente/" + cpf, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "nome": nome,
                    "telefone": tel,
                    "email": email
                })

            })
                .then((resposta) => { return resposta.json() })
                .then((dados) => {
                    if (dados.status) {
                        alert("Cliente alterado com sucesso!")
                        formulario.reset()
                        btnCadastrar.disabled = false
                        btnAlterar.disabled = true;
                        btnCancelar.disabled = true;
                        exibirTabelaClientes()
                    }
                    else {
                        alert(dados.mensagem)
                    }
                })
                .catch((erro) => {
                    alert("Não foi possível alterar o cliente:" + erro.message)
                })
        }
    }
}

function prepararTela(cpf="",nome="", tel="", email="", acao="")
{
    let btnCadastrar = document.getElementById("btnCadastrar")
    let btnAlterar = document.getElementById("btnAlterar")
    let btnCancelar = document.getElementById("btnCancelar")

    if(acao == "alterar")
    {
        btnCadastrar.disabled = true
        btnAlterar.disabled = false;
        btnCancelar.disabled = false;

        document.getElementById("cpf").value = cpf
        document.getElementById("nome").value = nome
        document.getElementById("tel").value = tel
        document.getElementById("email").value = email   
    }
    else 
    if(acao == "cancelar")
    {
        if(confirm("Deseja cancelar a alteração?"))
        {
            btnCadastrar.disabled = false
            btnAlterar.disabled = true
            btnCancelar.disabled = true
            formulario.reset()
            document.getElementById("cpf").value = "";
        }
    }            
}

function exibirTabelaClientes() {
    const espacoTabela = document.getElementById('tabelaClientes')
    espacoTabela.innerHTML = ""

    fetch("http://localhost:4000/cliente", { method: "GET" })
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json()
            }
        })
        .then((dados) => {
            if (dados.status) {
                const tabela = document.createElement("table")
                tabela.className = "table table-striped table-hover"

                const cabecalho = document.createElement("thead")
                cabecalho.innerHTML = `
                <table class="table table-dark table-striped">
                    <tr>
                        <th>CPF</th>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Email</th>
                    </tr>
                </table>
                `
                tabela.appendChild(cabecalho)

                const corpoTabela = document.createElement("tbody")

                for (const cliente of dados.clientes) {
                    const linha = document.createElement("tr")

                    linha.innerHTML += `
                    <td>${cliente.cpf}</td>
                    <td>${cliente.nome}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.email}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-warning" onclick="prepararTela('${cliente.cpf}','${cliente.nome}','${cliente.telefone}',\
                            '${cliente.email}','alterar')">
                                <i class="bi bi-pencil-fill"></i>
                            </button>
                            <button type="button" class="btn btn-danger" onclick="excluirCliente('${cliente.cpf}')">
                                <i class="bi bi-trash-fill"></i>
                            </button>
                        </div>
                    </td>

                `
                    corpoTabela.appendChild(linha)
                }
                tabela.appendChild(corpoTabela)
                espacoTabela.appendChild(tabela)
            }
        })
}