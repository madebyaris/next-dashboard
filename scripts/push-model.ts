#!/usr/bin/env node
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import chalk from 'chalk'

const execAsync = promisify(exec)

async function getModelsFromSchema(): Promise<string[]> {
  const schemaPath = path.join(process.cwd(), 'prisma/schema.prisma')
  const schema = fs.readFileSync(schemaPath, 'utf-8')
  
  // Extract model names using regex
  const modelRegex = /model\s+(\w+)\s*{/g
  const models: string[] = []
  let match

  while ((match = modelRegex.exec(schema)) !== null) {
    models.push(match[1])
  }

  return models
}

async function pushModel() {
  try {
    console.log(chalk.cyan('\n🚀 Prisma Model Pusher\n'))

    // Get all models from schema
    const models = await getModelsFromSchema()

    if (models.length === 0) {
      console.log(chalk.red('No models found in schema.prisma'))
      return
    }

    // Let user select models to push
    const { selectedModels } = await prompts({
      type: 'multiselect',
      name: 'selectedModels',
      message: 'Select models to push to the database:',
      choices: models.map((model: string) => ({
        title: model,
        value: model
      })),
      min: 1,
      instructions: false,
      hint: '- Space to select. Enter to submit'
    })

    if (!selectedModels || selectedModels.length === 0) {
      console.log(chalk.red('No models selected'))
      return
    }

    // Generate filter string for prisma db push
    const filterString = selectedModels.map((model: string) => `${model}`).join(',')

    console.log(chalk.yellow('\nPushing selected models to database...'))
    
    // Run prisma db push with --accept-data-loss flag
    const command = `pnpm prisma db push --accept-data-loss --schema-only --filter "${filterString}"`
    
    console.log(chalk.dim(`Running: ${command}`))
    
    const { stdout } = await execAsync(command)
    console.log(stdout)

    // Run prisma generate to update client
    await execAsync('pnpm prisma generate')
    
    console.log(chalk.green('\n✅ Models pushed successfully!'))
    console.log(chalk.cyan('\nPushed models:'))
    selectedModels.forEach((model: string) => {
      console.log(`- ${model}`)
    })

  } catch (error) {
    console.error(chalk.red('Error:'), error)
    process.exit(1)
  }
}

pushModel() 