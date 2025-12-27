function tsMain(): void {
    let i: number = 0;
    let j: number = 0;
    let k: number = 0;
    let sum: number = 0;
    
    // For loop example
    for (i = 0; i < 5; i++) {
        sum += i;
        console.log("For loop iteration: " + i);
    }
    
    // While loop example
    while (j < 3) {
        console.log("While loop iteration: " + j);
        j++;
    }
    
    // Do-while loop example
    do {
        console.log("Do-while loop iteration: " + k);
        k++;
    } while (k < 2);
    
    console.log("Sum: " + sum);
    console.log("Final counters: i=" + i + ", j=" + j + ", k=" + k);
}

tsMain();