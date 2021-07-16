import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response){
    if(request.method === 'POST'){     
        const TOKEN = '904cf569f323409a16e480b0502c6a';
        const client = new SiteClient(TOKEN);
        const registroCriado = await client.items.create({
            itemType: "972901",
            ...request.body,
        })

        console.log(registroCriado);
        
        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        })
        return;
    }
    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem'
    })
}