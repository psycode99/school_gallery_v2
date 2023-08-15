import fs from 'fs';
import http from 'http';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url)

const server = http.createServer((req, res) => {
    let filePath = path.join(
        path.dirname(__filename),
        'public', 
        req.url === '/' ? 'index.htm' : req.url
    )

    let extname  = path.extname(filePath);

    let contentType = 'text/html'

    switch (extname) {
        case '.js':
            contentType = 'text/javascript'  
            break;
        
        case '.css':
            contentType = 'text/css'  
            break;

        case '.json':
            contentType = 'application/json'  
            break;

        case '.png':
            contentType = 'image/png'  
            break;

        case '.jpg':
            contentType = 'image/jpg'  
            break;

        case '.svg':
            contentType = "image/svg+xml"  
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err){
            if (err.code === 'ENOENT'){
                // page not found

                fs.readFile(
                    path.join(path.dirname(__filename), 'public', '404.html'),
                    (err, content) =>{
                        if (err) throw err;
                        res.setHeader('200', {'Content-Type': 'text/html' });
                        res.end(content, 'utf8');
                    }
                )
            }else{
                // server error
                res.setHeader('500');
                res.end(`<h1>Server Error: ${err.code} </h1>`)
            }
        }else{
            // page successfully loaded
            res.setHeader('200', {'Content-Type': 'text/html' });
            res.end(content, 'utf8')
        }
    })
})


const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))