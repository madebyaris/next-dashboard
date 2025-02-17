# AI Prompting Guide

This guide provides templates and best practices for writing effective prompts when working with AI tools in this framework.

## Prompt Templates

### 1. Resource Creation

```
I need to create a [resource type] with these fields:
[List fields with types and requirements]

Requirements:
- [Any specific validation rules]
- [Any relations to other models]
- [Any special behaviors]

Please help me with the correct CLI command and any necessary customizations.
```

### 2. Form Customization

```
I want to customize the [resource] form:

Current structure:
[Paste relevant part of the form configuration]

Needed changes:
1. [Specific change needed]
2. [Another change needed]

Please help me modify this while maintaining the framework's structure.
```

### 3. Table Customization

```
I need to modify the [resource] table to:
1. [Add/modify specific column]
2. [Add custom filter]
3. [Add custom action]

Current configuration:
[Paste relevant part of routes.ts]

Please help me implement these changes using the framework's patterns.
```

### 4. Business Logic

```
I need to add custom business logic to [resource]:

Requirement:
[Describe the business logic]

Where should this logic live?
What's the best way to implement this within the framework?
```

## Best Practices

### 1. Be Specific About Location

✅ DO:
```
I need to modify src/resources/products/schema.ts to add validation
```

❌ DON'T:
```
I need to add validation to products
```

### 2. Provide Context

✅ DO:
```
Current code:
[paste relevant code]

I need to add X while maintaining the existing structure
```

❌ DON'T:
```
How do I add X?
```

### 3. Reference Framework Patterns

✅ DO:
```
I want to add a custom action following the same pattern as the existing edit/delete actions
```

❌ DON'T:
```
I want to add a custom button to do X
```

## Common Scenarios

### 1. Adding Custom Fields

```
I need to add a custom field to [resource]:

Field details:
- Name: [name]
- Type: [type]
- Validation: [rules]
- UI Component: [component type]

Please help me:
1. Update the schema
2. Add the form field
3. Add the table column
```

### 2. Adding Relations

```
I need to create a relation between [resource1] and [resource2]:

Relation type:
- [One-to-One/One-to-Many/Many-to-Many]
- [Required/Optional]
- [Cascade behavior]

Please help me with:
1. CLI command for updating models
2. Any necessary schema modifications
3. Form field updates
```

### 3. Custom Validation

```
I need to add custom validation to [field] in [resource]:

Validation rules:
1. [Rule 1]
2. [Rule 2]

Current schema:
[paste current schema]

Please help me implement this using Zod within the framework's patterns.
```

### 4. Custom Actions

```
I need to add a custom action to [resource]:

Action details:
- Name: [name]
- Trigger: [table action/form submit/etc]
- Logic: [describe what it should do]
- UI feedback: [what should user see]

Please help me implement this using server actions and the framework's patterns.
```

## Troubleshooting Prompts

### 1. Error Resolution

```
I'm getting this error:
[Error message]

Context:
- File: [file path]
- Action: [what triggered the error]
- Framework version: [version]

What's the correct way to fix this within the framework?
```

### 2. Performance Issues

```
I'm having performance issues with [feature]:

Current implementation:
[paste relevant code]

Symptoms:
- [Issue 1]
- [Issue 2]

How can I optimize this using the framework's patterns?
```

### 3. Type Errors

```
I'm getting TypeScript errors in [file]:

Error:
[Error message]

Related code:
[paste relevant code]

How should I properly type this within the framework?
```

## Framework-Specific Patterns

### 1. Data Fetching

```
I need to fetch [data] in [component]:

Requirements:
- [Caching needs]
- [Real-time updates?]
- [Error handling]

What's the recommended pattern in this framework?
```

### 2. Form Handling

```
I need to handle form submission in [component]:

Form data:
- [Field 1]
- [Field 2]

Requirements:
- [Validation needs]
- [File uploads?]
- [Success/error handling]

How should I implement this using the framework's patterns?
```

### 3. State Management

```
I need to manage [type of state] in [component]:

State requirements:
- [Persistence needs]
- [Sharing between components?]
- [Performance considerations]

What's the recommended approach in this framework?
```

## Remember

1. Always start with CLI tools for resource creation
2. Maintain the framework's file structure
3. Use server actions for data operations
4. Follow existing patterns for consistency
5. Be specific in your prompts about what you need 