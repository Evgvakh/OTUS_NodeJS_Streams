import fs from 'fs'
import { Transform } from 'stream'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execTransformFunc = async () => {
    const readStream = fs.createReadStream(path.join(__dirname, 'input.txt'), { encoding: 'utf8' })
    const writeStream = fs.createWriteStream(path.join(__dirname, 'output.txt'), { encoding: 'utf8' })
       
    const transform = new Transform({
        transform(chunk, _, callback) {
            let stringsArray = chunk.toString()
                .replace(/[.,/\\]/g, '')
                .split(' ')
                .filter(el => el.trim() != '')
                .sort((a, b) => (
                    a > b ? 1 : a < b ? -1 : 0
                ))

            stringsArray = stringsArray.reduce((acc, curr) => {                
                if(!acc.hasOwnProperty(curr)) {
                    acc[curr] = 1
                } else {
                    acc[curr]++
                }
                return acc
            }, {})
            let outputData = Object.values(stringsArray)
            console.log(outputData)
            callback(null, outputData.join(', '))
        }
    })
    readStream.pipe(transform).pipe(writeStream)

    writeStream.on('finish', () => {
        console.log('Succesfully handled')
    })
}

await execTransformFunc()