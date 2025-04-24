const WebSocket = require('ws');
const fs = require('fs');

const PORT = 4000

const wss = new WebSocket.Server({ port: PORT });

function add(obj){
    fs.readFile('data.json','utf-8',(err,data)=>{
        if (err) throw err;
        let res = JSON.parse(data);
        res.push(obj);
        fs.writeFile('data.json',JSON.stringify(res),err=>{
            if (err) throw err;
            console.log('增添：'+obj);
        })
    });
}

wss.on('connection', (ws)=>{

    ws.on('message', (message)=>{
        
        const messageStr=message.toString();

        switch (messageStr.slice(0,4)){
            case "0x01":
                add(messageStr.slice(4));
                console.log('添加消息：'+messageStr);
                break;
            case "0x02":
                fs.readFile('data.json','utf-8',(err,data)=>{
                    if (err) throw err;
                    ws.send(data);
                });
                console.log('返回更新');
                break;
            default:
                console.log('unknown code: '+messageStr.slice(0,4));
                break;
        }

    });
});

console.log('ws-server is running on localhost:'+PORT);