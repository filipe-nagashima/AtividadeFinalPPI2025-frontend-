
const formulario = document.getElementById("formLivro")

formulario.onsubmit = gravarLivro

let listaClientes = [];

carregarClientes()

document.getElementById('btnAlterar').addEventListener('click', alterarLivro);
document.getElementById('btnCancelar').addEventListener('click', () => {
    prepararTela('','','','','cancelar');
});

exibirTabelaLivros()

function gravarLivro(evento) {
    if (validarFormulario()) {
        const titulo = document.getElementById("titulo").value
        const autor = document.getElementById("autor").value
        const cpf = document.getElementById("nomecliente").value

        const clienteSelecionado = listaClientes.find(c => c.cpf === cpf);

        fetch("http://localhost:4000/livro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "liv_titulo": titulo,
                "liv_autor": autor,
                "cliente": {
                            "cpf": clienteSelecionado.cpf,
                            "nome": clienteSelecionado.nome,
                            "telefone": clienteSelecionado.telefone,
                            "email": clienteSelecionado.email
                            }

            })

        })
            .then((resposta) => { return resposta.json() })
            .then((dados) => {
                if (dados.status) {
                    alert("Livro cadastrado com sucesso!")
                    formulario.reset()
                    exibirTabelaLivros()
                }
                else {
                    alert(dados.mensagem)
                }
            })
            .catch((erro) => {
                alert("Não foi possível gravar o livro:" + erro.message)
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

function carregarClientes(){
    fetch("http://localhost:4000/cliente", { method: "GET" })
    .then((resposta) => 
    {
        if(resposta.ok)
        {
            return resposta.json()
        }
    })
    .then((dados) => 
    {
        if(dados.status)
        {
            listaClientes = dados.clientes
            const selectClientes = document.getElementById("nomecliente")
            for(const cliente of dados.clientes)
            {
                const option = document.createElement("option")
                option.value = cliente.cpf
                option.textContent = cliente.nome
                selectClientes.appendChild(option)
            }
        }
    })
    .catch((erro) =>
    {
        alert("Não foi possível recuperar os clientes do backend: " + erro.message)
    })
}

function excluirLivro(cod_livro) {
    if (confirm("Deseja excluir o livro?")) {
        fetch("http://localhost:4000/livro/" + cod_livro, { method: "DELETE" })
            .then((resposta) => {
                if (resposta.ok) {
                    return resposta.json()
                }
            })
            .then((dados) => {
                if (dados.status) {
                    exibirTabelaLivros()
                }
                alert(dados.mensagem)
            })
            .catch((erro) => {
                alert("Não foi possível excluir o livro:" + erro.message)
            })

    }
}

function alterarLivro() {
    let btnCadastrar = document.getElementById("btnCadastrar")
    let btnAlterar = document.getElementById("btnAlterar")
    let btnCancelar = document.getElementById("btnCancelar")

    if (confirm("Deseja alterar o livro?")) {
        if (validarFormulario()) {
            const cod_livro = document.getElementById("cod").value
            const titulo = document.getElementById("titulo").value
            const autor = document.getElementById("autor").value
            const cpf = document.getElementById("nomecliente").value

            const clienteSelecionado = listaClientes.find(c => c.cpf === cpf);

            fetch("http://localhost:4000/livro/" + cod_livro, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "liv_titulo": titulo,
                    "liv_autor": autor,
                    "cliente": {
                            "cpf": clienteSelecionado.cpf,
                            "nome": clienteSelecionado.nome,
                            "telefone": clienteSelecionado.telefone,
                            "email": clienteSelecionado.email
                            }
                })

            })
                .then((resposta) => { return resposta.json() })
                .then((dados) => {
                    if (dados.status) {
                        alert("Livro alterado com sucesso!")
                        formulario.reset()
                        document.getElementById("cod").value = "";
                        btnCadastrar.disabled = false
                        btnAlterar.disabled = true;
                        btnCancelar.disabled = true;
                        exibirTabelaLivros()
                    }
                    else {
                        alert(dados.mensagem)
                    }
                })
                .catch((erro) => {
                    alert("Não foi possível alterar o livro:" + erro.message)
                })
        }
    }
}

function prepararTela(cod_livro="",titulo="", autor="", cpf="", acao="")
{
    let btnCadastrar = document.getElementById("btnCadastrar")
    let btnAlterar = document.getElementById("btnAlterar")
    let btnCancelar = document.getElementById("btnCancelar")

    if(acao == "alterar")
    {
        btnCadastrar.disabled = true
        btnAlterar.disabled = false;
        btnCancelar.disabled = false;

        document.getElementById("cod").value = cod_livro
        document.getElementById("titulo").value = titulo
        document.getElementById("autor").value = autor
        document.getElementById("nomecliente").value = cpf
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
            document.getElementById("cod").value = "";
        }
    }            
}

function exibirTabelaLivros() {
    const espacoTabela = document.getElementById('tabelaLivros')
    espacoTabela.innerHTML = ""

    fetch("http://localhost:4000/livro", { method: "GET" })
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
                        <th>Cód</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Cliente</th>
                    </tr>
                </table>
                `
                tabela.appendChild(cabecalho)

                const corpoTabela = document.createElement("tbody")

                for (const livro of dados.livros) {
                    const linha = document.createElement("tr")
                    
                    linha.innerHTML += `
                    <td>${livro.cod}</td>
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${livro.cliente.nome}</td>
                    <td>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-warning" onclick="prepararTela('${livro.cod}','${livro.titulo}','${livro.autor}',\
                            '${livro.cliente.cpf}','alterar')">
                                <i class="bi bi-pencil-fill"></i>
                            </button>
                            <button type="button" class="btn btn-danger" onclick="excluirLivro('${livro.cod}')">
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