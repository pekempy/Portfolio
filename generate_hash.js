import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter password to hash: ', (password) => {
    const hash = bcrypt.hashSync(password, 10);
    console.log('\n--- BCRYPT HASH ---');
    console.log(hash);
    console.log('-------------------\n');
    rl.close();
});
