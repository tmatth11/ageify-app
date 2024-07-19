#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function main() {
    let exit = false;

    const welcome = "Agify App";

    const figletPromise = new Promise((resolve, reject) => {
        figlet(welcome, (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(gradient.pastel.multiline(data));
                resolve();
            }
        });
    });

    await figletPromise;

    console.log(`
       Welcome to the ${chalk.yellow("Agify App")}!
       This app will predict the age of a person based on their name.
    `);

    while (!exit) {
        const { name } = await inquirer.prompt({
            name: 'name',
            type: 'input',
            message: 'Enter a name (or exit to quit):',
        });

        console.log();

        if (name.toLowerCase() === 'exit') {
            exit = true;
            let goodbye = chalkAnimation.rainbow('Goodbye!');
            await sleep(1000);
            goodbye.stop();
            return;
        }
        else if (name.trim() === '') {
            console.log(chalk.red('Please enter a name.\n'));
            continue;
        }

        const spinner = createSpinner(`Fetching data for: ${name}...`).start();
        await sleep();

        try {
            const response = await fetch(`https://api.agify.io?name=${name}`);
            const data = await response.json();

            if (data === null || data.age === null) {
                spinner.error({ text: `${chalk.red(`No data found for: ${name}`)}\n` });
            }

            spinner.success({ text: `${chalk.green(`The predicted age for the name "${name}" is ${data.age} years old.\n`)}` });
        }
        catch (e) {
            spinner.error({text: `${chalk.red(`An error occurred while fetching data for: ${name}`)}`});
        }
    }
}

await main();