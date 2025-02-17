#!/usr/bin/env node
import { exec } from 'child_process'
import { promisify } from 'util'
import chalk from 'chalk'

const execAsync = promisify(exec)

interface Field {
  name: string
  type: string
  isRequired: boolean
  isUnique: boolean
  hasDefault: boolean
  defaultValue?: string
  isRelation: boolean
  relationModel?: string
  relationField?: string
  relationOnDelete?: 'CASCADE' | 'SET_NULL' | 'RESTRICT'
}

interface ModelConfig {
  name: string
  fields: Field[]
  createDashboard: boolean
}

async function createModelFromAI(description: string) {
  try {
    // Get description from command line argument
    if (!description) {
      console.error(chalk.red('Error: Model description is required'))
      console.log(chalk.yellow('\nUsage:'))
      console.log('pnpm create-model-speed-ai "Create a Product model with: - name (string, required)"')
      process.exit(1)
    }

    // Execute create-model-speed with the parsed configuration
    const command = `pnpm create-model-speed`
    const child = exec(command)

    // Handle the interactive prompts
    if (child.stdin) {
      // Parse the description using the AI agent's capabilities
      // The AI agent should implement the logic to:
      // 1. Extract model name
      // 2. Parse fields and their types
      // 3. Handle relations
      // 4. Set appropriate defaults
      
      // For now, we'll just pass through the raw description
      // The AI agent should intercept this script's execution and handle the parsing
      child.stdin.write(description + '\n')
      child.stdin.end()
    }

    // Wait for the process to complete
    await new Promise((resolve, reject) => {
      child.on('exit', code => {
        if (code === 0) resolve(null)
        else reject(new Error(`Process exited with code ${code}`))
      })
    })

    console.log(chalk.green('\n✨ Model created successfully!'))
    console.log(chalk.cyan('\nNext steps:'))
    console.log('1. Review the generated files')
    console.log('2. Push your model to the database:')
    console.log(chalk.dim('   pnpm push-model'))
    console.log('3. Customize the generated components as needed')

  } catch (error) {
    console.error(chalk.red('Error:'), error)
    process.exit(1)
  }
}

// Get the description from command line arguments
const description = process.argv.slice(2).join(' ')
createModelFromAI(description) 