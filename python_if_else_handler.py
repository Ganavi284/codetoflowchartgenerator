import os
import json
from typing import Optional


class IfElseHandler:
    """
    A class to handle if-else logic in Python with file operations and connectivity handling.
    """
    
    def __init__(self, output_file_path: str = "output.txt"):
        self.output_file_path = output_file_path
        self.connectivity_data = {}
    
    def check_file_exists(self) -> bool:
        """
        Check if the output file exists.
        
        Returns:
            bool: True if file exists, False otherwise
        """
        return os.path.exists(self.output_file_path)
    
    def create_file_if_not_exists(self) -> bool:
        """
        Create the output file if it doesn't exist.
        
        Returns:
            bool: True if file was created or already existed, False if creation failed
        """
        try:
            if not self.check_file_exists():
                # Create the file with a default message
                with open(self.output_file_path, 'w') as f:
                    f.write("Output file created successfully.\n")
                print(f"Created new file: {self.output_file_path}")
                return True
            else:
                print(f"File already exists: {self.output_file_path}")
                return True
        except Exception as e:
            print(f"Error creating file: {e}")
            return False
    
    def handle_if_else_logic(self, condition: bool) -> str:
        """
        Handle if-else logic based on the provided condition.
        
        Args:
            condition (bool): The condition to evaluate
            
        Returns:
            str: Result of the if-else evaluation
        """
        if condition:
            result = "Condition is True - executing if block"
            print(result)
            return result
        else:
            result = "Condition is False - executing else block"
            print(result)
            return result
    
    def handle_connectivity_after_if_else(self, data: Optional[dict] = None) -> dict:
        """
        Handle connectivity after if-else block execution.
        
        Args:
            data (dict, optional): Additional data to include in connectivity handling
            
        Returns:
            dict: Connectivity status and related information
        """
        # Simulate connectivity handling
        connectivity_status = {
            "status": "connected",
            "timestamp": self._get_timestamp(),
            "file_path": self.output_file_path,
            "file_exists": self.check_file_exists(),
            "additional_data": data or {}
        }
        
        # Store connectivity data for later use
        self.connectivity_data = connectivity_status
        
        # Append connectivity info to output file
        try:
            with open(self.output_file_path, 'a') as f:
                f.write(f"\nConnectivity established at: {connectivity_status['timestamp']}\n")
                f.write(f"Status: {connectivity_status['status']}\n")
        except Exception as e:
            print(f"Error writing connectivity info to file: {e}")
        
        return connectivity_status
    
    def _get_timestamp(self) -> str:
        """
        Get current timestamp as string.
        
        Returns:
            str: Current timestamp
        """
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    def process_with_if_else(self, condition: bool, additional_data: Optional[dict] = None):
        """
        Main method to process if-else logic with file handling and connectivity.
        
        Args:
            condition (bool): Condition for if-else evaluation
            additional_data (dict, optional): Additional data for connectivity
        """
        print("Starting if-else processing...")
        
        # Check if output file exists, create if it doesn't
        file_created = self.create_file_if_not_exists()
        
        if file_created:
            # Handle if-else logic
            result = self.handle_if_else_logic(condition)
            
            # Handle connectivity after if-else block
            connectivity_result = self.handle_connectivity_after_if_else(additional_data)
            
            print("If-else processing completed successfully.")
            print(f"Connectivity status: {connectivity_result['status']}")
        else:
            print("Failed to create output file. Cannot proceed with processing.")


def main():
    """
    Main function to demonstrate the IfElseHandler functionality.
    """
    # Create handler instance
    handler = IfElseHandler("result_output.txt")
    
    # Example 1: Condition is True
    print("=== Example 1: Condition is True ===")
    handler.process_with_if_else(True, {"example": "data1", "value": 100})
    
    print("\n" + "="*50 + "\n")
    
    # Example 2: Condition is False
    print("=== Example 2: Condition is False ===")
    handler.process_with_if_else(False, {"example": "data2", "value": 200})
    
    print("\n" + "="*50 + "\n")
    
    # Example 3: Using different output file
    handler2 = IfElseHandler("another_output.txt")
    print("=== Example 3: Different output file ===")
    handler2.process_with_if_else(True, {"example": "data3", "value": 300})


if __name__ == "__main__":
    main()