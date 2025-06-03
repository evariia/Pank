// Import necessary modules from mongoose for schema and model creation
import { Document, Schema, model, Model } from "mongoose";

// Import decorators from class-validator for validating class properties
import { IsString, Length, IsBoolean, IsOptional } from "class-validator";

// Import dependency injection container from tsyringe
import { container } from "tsyringe";

// Define the ITodo interface representing the shape of a Todo object
interface ITodo {
  title: string;         // Title of the todo item
  description: string;   // Description of the todo item
  completed: boolean;    // Status indicating if the todo is completed
}

// Validator class for creating or fully updating a Todo item
// Implements ITodo interface to ensure all fields are present
class TodoValidator implements ITodo {
  @IsString()            // Validate that title is a string
  @Length(2, 50)         // Validate title length between 2 and 50 characters
  title: string;

  @IsString()            // Validate that description is a string
  @Length(2, 100)        // Validate description length between 2 and 100 characters
  description: string;

  @IsOptional()          // completed is optional during validation
  @IsBoolean()           // If provided, completed must be a boolean
  completed: boolean;
}

// Validator class for patch updates (partial updates) on a Todo item
// All fields are optional to allow partial updates
class TodoValidatorForPatch implements ITodo {
  @IsOptional()          // title is optional
  @IsString()            // If provided, must be a string
  @Length(2, 50)         // Length constraints apply if provided
  title: string;

  @IsOptional()          // description is optional
  @IsString()            // If provided, must be a string
  @Length(2, 100)        // Length constraints apply if provided
  description: string;

  @IsOptional()          // completed is optional
  @IsBoolean()           // If provided, must be a boolean
  completed: boolean;
}

// Interface combining ITodo with mongoose Document for typing mongoose documents
interface ITodoDocument extends ITodo, Document {}

// Define the mongoose schema for the Todo collection
const todoSchema = new Schema<ITodoDocument>({
  title: { type: String, required: true },          // title is required string
  description: { type: String, required: true },    // description is required string
  completed: { type: Boolean, default: false },     // completed is boolean, defaults to false
});

// Create the mongoose model for Todo using the schema and interface
const TodoModel: Model<ITodoDocument> = model("Todo", todoSchema);

// Register the TodoModel in the tsyringe dependency injection container
// This allows TodoModel to be injected wherever needed by referencing "TodoModel"
container.register<Model<ITodoDocument>>("TodoModel", { useValue: TodoModel });

// Export interfaces, model, and validators for use in other parts of the application
export {
  ITodo,
  ITodoDocument,
  TodoModel,
  TodoValidator,
  TodoValidatorForPatch,
}
