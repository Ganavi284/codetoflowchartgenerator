import os
import json
from datetime import datetime
from typing import Optional, Dict, Any


class DetailedIfElseHandler:
    """
    A comprehensive class to handle if-else logic in Python with file operations and connectivity handling.
    This demonstrates a real-world scenario with proper error handling and logging.
    """
    
    def __init__(self, output_file_path: str = "detailed_output.txt"):
        self.output_file_path = output_file_path
        self.connectivity_data = {}
        self.log_entries = []
    
    def log(self, message: str):
        """Add a log entry with timestamp."""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {message}"
        self.log_entries.append(log_entry)
        print(log_entry)
    
    def check_file_exists(self) -> bool:
        """
        Check if the output file exists.
        
        Returns:
            bool: True if file exists, False otherwise
        """
        exists = os.path.exists(self.output_file_path)
        self.log(f"File '{self.output_file_path}' exists: {exists}")
        return exists
    
    def create_file_if_not_exists(self) -> bool:
        """
        Create the output file if it doesn't exist.
        
        Returns:
            bool: True if file was created or already existed, False if creation failed
        """
        try:
            if not self.check_file_exists():
                # Create the file with a header
                with open(self.output_file_path, 'w', encoding='utf-8') as f:
                    f.write(f"Output Log - Created: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                    f.write("="*50 + "\n")
                self.log(f"Created new file: {self.output_file_path}")
                return True
            else:
                self.log(f"File already exists: {self.output_file_path}")
                return True
        except Exception as e:
            self.log(f"Error creating file: {e}")
            return False
    
    def handle_if_else_logic(self, condition: bool, context: str = "") -> Dict[str, Any]:
        """
        Handle if-else logic based on the provided condition with detailed information.
        
        Args:
            condition (bool): The condition to evaluate
            context (str): Additional context for the if-else evaluation
            
        Returns:
            dict: Result of the if-else evaluation with metadata
        """
        if condition:
            result = {
                "evaluation": "if_block_executed",
                "message": f"Condition is True - executing if block{f' ({context})' if context else ''}",
                "condition_met": True,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            self.log(result["message"])
        else:
            result = {
                "evaluation": "else_block_executed", 
                "message": f"Condition is False - executing else block{f' ({context})' if context else ''}",
                "condition_met": False,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            self.log(result["message"])
        
        # Append if-else result to output file
        try:
            with open(self.output_file_path, 'a', encoding='utf-8') as f:
                f.write(f"\nIF-ELSE EVALUATION: {result['message']}\n")
                f.write(f"Timestamp: {result['timestamp']}\n")
        except Exception as e:
            self.log(f"Error writing if-else result to file: {e}")
        
        return result
    
    def simulate_connectivity_task(self, task_name: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Simulate a connectivity task after if-else execution.
        
        Args:
            task_name (str): Name of the connectivity task
            data (dict): Data to process in the connectivity task
            
        Returns:
            dict: Result of the connectivity task
        """
        self.log(f"Starting connectivity task: {task_name}")
        
        # Simulate some connectivity work
        task_result = {
            "task": task_name,
            "status": "success",
            "processed_data": data,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "file_path": self.output_file_path,
            "file_exists": self.check_file_exists()
        }
        
        # Log the connectivity task in the output file
        try:
            with open(self.output_file_path, 'a', encoding='utf-8') as f:
                f.write(f"\nCONNECTIVITY TASK: {task_name}\n")
                f.write(f"Status: {task_result['status']}\n")
                f.write(f"Timestamp: {task_result['timestamp']}\n")
                f.write(f"Processed Data: {json.dumps(data, indent=2)}\n")
                f.write("-" * 30 + "\n")
        except Exception as e:
            self.log(f"Error writing connectivity task to file: {e}")
        
        self.log(f"Completed connectivity task: {task_name}")
        return task_result
    
    def handle_connectivity_after_if_else(self, additional_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Handle connectivity after if-else block execution.
        
        Args:
            additional_data (dict, optional): Additional data to include in connectivity handling
            
        Returns:
            dict: Connectivity status and related information
        """
        self.log("Starting connectivity handling after if-else block...")
        
        # Prepare connectivity data
        connectivity_data = {
            "status": "connected",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "file_path": self.output_file_path,
            "file_exists": self.check_file_exists(),
            "additional_data": additional_data or {},
            "log_entries_count": len(self.log_entries)
        }
        
        # Store connectivity data for later use
        self.connectivity_data = connectivity_data
        
        # Perform connectivity tasks
        tasks_results = []
        
        # Task 1: Save connectivity info
        task1_result = self.simulate_connectivity_task(
            "save_connectivity_info", 
            {"connectivity_data": connectivity_data}
        )
        tasks_results.append(task1_result)
        
        # Task 2: Process additional data
        if additional_data:
            task2_result = self.simulate_connectivity_task(
                "process_additional_data",
                {"additional_data": additional_data}
            )
            tasks_results.append(task2_result)
        
        # Task 3: Finalize connection
        task3_result = self.simulate_connectivity_task(
            "finalize_connection",
            {"final_status": "completed", "tasks_completed": len(tasks_results)}
        )
        tasks_results.append(task3_result)
        
        final_result = {
            "overall_status": "connected",
            "timestamp": connectivity_data["timestamp"],
            "tasks_results": tasks_results,
            "connectivity_data": connectivity_data
        }
        
        self.log("Connectivity handling completed successfully.")
        return final_result
    
    def process_with_if_else(self, condition: bool, context: str = "", additional_data: Optional[Dict[str, Any]] = None):
        """
        Main method to process if-else logic with file handling and connectivity.
        
        Args:
            condition (bool): Condition for if-else evaluation
            context (str): Context for the if-else evaluation
            additional_data (dict, optional): Additional data for connectivity
        """
        self.log("Starting detailed if-else processing...")
        
        # Check if output file exists, create if it doesn't
        file_created = self.create_file_if_not_exists()
        
        if file_created:
            # Handle if-else logic
            if_else_result = self.handle_if_else_logic(condition, context)
            
            # Handle connectivity after if-else block
            connectivity_result = self.handle_connectivity_after_if_else(additional_data)
            
            self.log("Detailed if-else processing completed successfully.")
            self.log(f"Final connectivity status: {connectivity_result['overall_status']}")
            
            return {
                "if_else_result": if_else_result,
                "connectivity_result": connectivity_result,
                "file_path": self.output_file_path
            }
        else:
            self.log("Failed to create output file. Cannot proceed with processing.")
            return None


def main():
    """
    Main function to demonstrate the DetailedIfElseHandler functionality.
    """
    print("=== Detailed If-Else Handler Demo ===\n")
    
    # Example 1: Positive condition with data
    print("Example 1: Condition is True with additional data")
    handler1 = DetailedIfElseHandler("demo_output_1.txt")
    result1 = handler1.process_with_if_else(
        condition=True,
        context="User authentication check",
        additional_data={
            "user_id": 12345,
            "session_token": "abc123xyz",
            "permissions": ["read", "write"]
        }
    )
    
    print("\n" + "="*60 + "\n")
    
    # Example 2: Negative condition without data
    print("Example 2: Condition is False without additional data")
    handler2 = DetailedIfElseHandler("demo_output_2.txt")
    result2 = handler2.process_with_if_else(
        condition=False,
        context="Feature availability check"
    )
    
    print("\n" + "="*60 + "\n")
    
    # Example 3: Complex condition with nested data
    print("Example 3: Complex condition with nested data")
    handler3 = DetailedIfElseHandler("demo_output_3.txt")
    result3 = handler3.process_with_if_else(
        condition=len([1, 2, 3, 4, 5]) > 3,  # This evaluates to True
        context="Data validation check",
        additional_data={
            "validation_rules": {
                "min_length": 3,
                "max_length": 10,
                "required_fields": ["name", "email"]
            },
            "input_data": {
                "name": "John Doe",
                "email": "john@example.com",
                "age": 30
            },
            "validation_result": "passed"
        }
    )
    
    print("\n" + "="*60)
    print("Demo completed! Check the output files for detailed logs.")
    print("- demo_output_1.txt")
    print("- demo_output_2.txt") 
    print("- demo_output_3.txt")


if __name__ == "__main__":
    main()