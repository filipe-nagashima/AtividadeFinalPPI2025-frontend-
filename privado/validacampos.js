document.addEventListener('DOMContentLoaded', function() {

    const formClientes = document.getElementById('formCliente')

    const cpf = document.getElementById('cpf')
    const tel = document.getElementById('tel')
    const email = document.getElementById('email')

    //Máscara CPF
    cpf.addEventListener('input',function(event){
        let aux = cpf.value.replace(/\D/g,'').slice(0,11)
        aux = aux.replace(/(\d{3})(\d)/, '$1.$2')
        aux = aux.replace(/(\d{3})(\d)/, '$1.$2')
        aux = aux.replace(/(\d{3})(\d{1,2})/, '$1-$2')
        
        cpf.value = aux
    })

    //validação do CPF
    function validaCPFComRegex(cpf) {
            // Remove caracteres não numéricos com RegEx
            cpf = cpf.replace(/\D/g, '');
            
            // Verifica se tem 11 dígitos
            if (!/^\d{11}$/.test(cpf)) return false;
            
            // Verifica se todos os dígitos são iguais
            if (/^(\d)\1{10}$/.test(cpf)) return false;
            
            // Validação dos dígitos verificadores
            let soma = 0;
            for (let i = 0; i < 9; i++) {
                soma += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let digito1 = 11 - (soma % 11);
            digito1 = digito1 > 9 ? 0 : digito1;

            soma = 0;
            for (let i = 0; i < 10; i++) {
                soma += parseInt(cpf.charAt(i)) * (11 - i);
            }
            let digito2 = 11 - (soma % 11);
            digito2 = digito2 > 9 ? 0 : digito2;

            return digito1 === parseInt(cpf.charAt(9)) && digito2 === parseInt(cpf.charAt(10));
        
    }
    

    cpf.addEventListener('input', function(){
        // Se o campo estiver vazio, remove qualquer validação
        if (cpf.value.trim() === "") {
            cpf.classList.remove('is-valid', 'is-invalid');
            feedbackCPF.feedback.textContent = ""; // limpa a mensagem de feedback
            return;
        }

        const cpfFormatoValido = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf.value)
        const cpfValido = validaCPFComRegex(cpf.value)
        if (cpfFormatoValido && cpfValido)
            aplicaClasseFeedback(cpf,true)
        else
            aplicaClasseFeedback(cpf,false)
        if(!cpfValido || !cpfFormatoValido)
            isValid = false
    })

    //Máscara Telefone
    tel.addEventListener('input',function(){
        let aux = tel.value.replace(/\D/g, '')
        if (aux.length <= 11){
            aux = aux.replace(/^(\d{2})(\d)/g, '($1) $2');
            aux = aux.replace(/(\d)(\d{4})$/, '$1-$2');
        }
        tel.value = aux
    })

    //validação do telefone
    tel.addEventListener('input', function(){
        // Se o campo estiver vazio, remove qualquer validação
        if (tel.value.trim() === "") {
            tel.classList.remove('is-valid', 'is-invalid');
            feedbackTel.feedback.textContent = ""; // limpa a mensagem de feedback
            return;
        }

        const auxTel = tel.value.replace(/\D/g, '')
        const celularValido = /^[1-9]{2}9[0-9]{8}$/.test(auxTel)
        const fixoValido = /^[1-9]{2}[2-5][0-9]{7}$/.test(auxTel)

        if(celularValido || fixoValido)
            aplicaClasseFeedback(tel,true)
        else
            aplicaClasseFeedback(tel,false)

        if(!celularValido || !fixoValido)
            isValid = false
    })

    //validação do e-mail
    email.addEventListener('input', function(){
        // Se o campo estiver vazio, remove qualquer validação
        if (email.value.trim() === "") {
            email.classList.remove('is-valid', 'is-invalid');
            feedbackEmail.feedback.textContent = ""; // limpa a mensagem de feedback
            return;
        }

        const emailValido = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email.value)
        aplicaClasseFeedback(email,emailValido)
        if(!emailValido)
            isValid = false
    })

    function aplicaClasseFeedback(input, isValid){
        input.classList.toggle('is-valid',isValid)
        input.classList.toggle('is-invalid',!isValid)
    }
    
})