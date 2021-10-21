// Modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

//Modulos internos(Core models)
const fs = require('fs')

console.log('inciamos o account')



const operation = ()=>{

    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            "Depositar",
            "Consultar Saldo",
            'Sacar',
            'Sair'
        ]
    }])
    .then((answer)=>{
        const action = answer['action']

        if(action === 'Criar Conta') createAccount()
        if(action === "Depositar")  deposit()
        if(action === "Consultar Saldo") checkBalance()
        if(action === 'Sacar') widthdraw()
        if(action === 'Sair') getOut()
    })
    .catch((err)=> console.log(err))

}

operation()

// Create an account

const createAccount = ()=>{
    console.log(chalk.bgGreen.black('Obrigado por escolher nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))

    buildAccount()
}

// buildAccount

const buildAccount = ()=>{

    inquirer.prompt([{
        name: 'accountName',
        message:'Digite um nome para sua conta:'
    }])
    .then((answer)=>{
        const accountName = answer['accountName']
     
        
        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black('Esta conta já existe, escolha outro nome'))
            buildAccount()
            return
        }

            fs.writeFileSync(
                `accounts/${accountName}.json`,
                '{"balance": 0}', 
                (err)=>{
                console.log(err)
                return
            },
        )

        console.log(chalk.green('Parabéns a sua conta foi criada!'))
        operation()
    })
    .catch((err)=>{
        console.log(err)
    })

}

// Add an amount to user account

const deposit = ()=>{

    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }])
    .then((answer)=>{

        const accountName = answer['accountName']
        // verify if account exist
        if(!accountExists(accountName)){
            return deposit()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Qual o valor para deposito?'
        }])
        .then((answer)=>{
            const amount = answer['amount']

            //add an amount
            addamount(accountName, amount)
            operation()
        })
        .catch((err)=>{
            console.log(err)
        })

    })
    .catch((err)=>{

    })
}

const accountExists = (accountName)=>{
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log(chalk.bgRed.black('Esta conta não existe!'))
        return false
    }
    return true
}

const addamount = (accountName, amount)=>{

    const accountData = getAccount(accountName)
    
    if(!amount) {
        console.log(chalk.red('Insira um valor para deposito!'))
        return 
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(`accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err)=>{
        console.log(err)
    }
    )
    console.log(chalk.green(`Deposito de R$${amount} realizado com sucesso na conta: ${accountName}`))
    
}

const getAccount = (accountName)=>{
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,
    {encoding: 'utf8',
    flag: 'r',
})

return JSON.parse(accountJSON)
}

// checkBalance

const checkBalance = ()=>{

    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da conta?'
    }])
    .then((answer)=>{
        const accountName = answer['accountName']

        //verify if account exists
        if(!accountExists(accountName)){
            return operation()
        }

        const accountData = getAccount(accountName)
        const balance = parseFloat(accountData['balance'])
       
        if( balance <= 0){
            console.log(chalk.red(`Seu saldo é de $${balance}`))
            return operation()
        }
        console.log(chalk.green(`Seu saldo é de $${balance}`))
         return operation()
         
    })
    .catch((err)=>{
        console.log(err)
    })
}

// widthdraw balance of the account

const widthdraw = ()=>{

    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }])
    .then((answer)=>{
        const accountName = answer['accountName']

        // verify if account exists
        if(!accountExists(accountName)){
            return operation()
        }
        inquirer.prompt([{
            name: 'amount',
            message: 'Quanto deseja sacar?'
        }])
        .then((answer)=>{
            const amount = parseFloat(answer['amount'])

            // removal of amount from user account
            if(!removeAmount(accountName, amount)){
                console.log(chalk.bgRed.black('Saldo insuficiente!'))
                return operation()
            }
        
                console.log(chalk.green(`Saque de R$${amount} autorizado pela instituição`))
                operation()
           
         })
         .catch((err)=>{
             console.log(err)
         })
    })
    .catch((err)=>{
        console.log(err)
    })
}

const removeAmount = (accountName, amount)=>{

    const accountData = getAccount(accountName)
    const balance = parseFloat(accountData['balance'])

        if(!amount || amount > balance){
                return false
        }
            
        accountData.balance = balance - amount
            fs.writeFileSync(`accounts/${accountName}.json`,
            JSON.stringify(accountData),
            (err)=>{
            console.log(err)
            })
                return true
}
// getOut of Account

const getOut = ()=>{
    console.log(chalk.bgBlueBright('Obrigado por usar o Account!'))
    process.exit()
}

