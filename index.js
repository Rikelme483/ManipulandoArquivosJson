import {promises as fs} from 'fs';

async function execute(){

    await createDir();
    await createState();
    await countCity('sp');
    await countCities();
}

async function createDir(){
    try{
        await fs.mkdir('./país');
        console.log('Diretório criado!');
        console.log('-------------------------------------------------------------')
    } catch(e){
        console.log("Diretório país já está criado!");
        console.log('-------------------------------------------------------------')
    }
}

async function createState(){

    try{

        let state = JSON.parse(await fs.readFile('Estados.json', 'UTF-8'));
        let city = JSON.parse(await fs.readFile('Cidades.json', 'UTF-8'));

        state.map(allStates => {

            fs.writeFile(`./país/${allStates.Sigla}.json`, " ");

            const item = city.filter(eachCity => allStates.ID == eachCity.Estado )

            try{

            fs.appendFile(`./país/${allStates.Sigla}.json`, JSON.stringify(item, null, 2));

            }catch(e){
                console.log(e)
            }

            
        })


    }catch(e){
        console.log("Erro!" + e)
    }

}


async function countCity(uf) {


    try {
        const read = JSON.parse(await fs.readFile(`./país/${uf}.json`, 'utf-8'));
        
        console.log(`A quantidade de cidades no estado ${uf} é: ${read.length} `);
        console.log('-------------------------------------------------------------')

    }catch(e){
        console.log(`Houve um erro! ${e} `)
    }

}



async function countCities(){

    try{
        let state = await fs.readdir('./país/');
        let array = [];

        for(let i = 0; i < state.length; i++) {
            
            let readJson = JSON.parse(await fs.readFile(`./país/${state[i]}`, 'utf-8'))
            
            // array.push({
            //     uf: state[i],
            //     cities: readJson.length
            // })

            array = [
                { uf: state[i], cities: readJson.length },
                ...array,
            ]
        }

        async function maioresCidades() {

            const bigCities = array.sort((a, b) => {
                return b.cities - a.cities;
            })

            return bigCities.slice(0, 5);
        }

        async function menoresCidades() {
            const lessCities = array.sort((a, b) => {
                return a.cities - b.cities;
            })

            return lessCities.slice(0, 5);
        }

        console.log("Os 5 estados com mais cidades do Brasil: ")
        console.log(await maioresCidades())
        console.log('-------------------------------------------------------------')
        console.log('Os 5 estados com menos cidades do Brasil: ')
        console.log(await menoresCidades())
        
    }catch(e){
        console.log("Ops! Ocorreu um erro. Tente novamente.")
    }

}

execute()
