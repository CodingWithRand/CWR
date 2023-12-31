const fs = require('fs');
const path = require('path');
const util = require('util');
const { exec } = require('child_process');
const { argv } = require('process');

const execPromise = util.promisify(exec);

const inputDirectory = path.join(__dirname, '../css/tailwind/');
const outputDirectory = path.join(__dirname, '../css/use/');

if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
}

fs.readdir(inputDirectory, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    cssFiles.forEach(async (file) => {
        const inputFile = path.join(inputDirectory, file);
        const outputFile = path.join(outputDirectory, file);
        const FLAG = {
            unknown_opt: false,
            unavailable_opt: false
        };

        function option(opts) {
            if(opts.length === 0){
                FLAG.unavailable_opt = true;
                return;
            }
            opts = opts.map((opt) => {
                switch(opt){
                    case '--run-continuously':
                        return '--watch'
                    case '--run':
                        return ''
                    default:
                        FLAG.unknown_opt = true;
                        break;
                };
            });
            return opts.join(' ');
        }

        try {
            const options = option(argv.slice(2).filter(arg => arg !== '--'))
            if(FLAG.unknown_opt) throw new Error("Unknown Option!");
            else if(FLAG.unavailable_opt) throw new Error("Option is not specified!")

            console.log(`Converting ${inputFile} to ${outputFile}...`);
            console.log(`npx tailwindcss -i \"${inputFile}\" -o \"${outputFile}\" ${options}`);
            const { stdout, stderr } = await execPromise(`npx tailwindcss -i \"${inputFile}\" -o \"${outputFile}\" ${options}`); 
            console.log("Convert Result: \n", stdout || stderr)
            
        } catch (error) {
            console.error(`Error converting ${inputFile}:`, error.message);
        }
    });
});
