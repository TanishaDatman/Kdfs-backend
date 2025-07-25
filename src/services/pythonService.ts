// import { spawn } from 'child_process';
// import path from 'path';

// export const callPython = <T = any>(script: string, input: any): Promise<T> => {
//   console.log(script)
//   return new Promise((resolve, reject) => {

//       const scriptPath = path.join(process.cwd(), 'src/python', script); 

//     const py = spawn('python3', [scriptPath], {
//       cwd: path.join(__dirname, '../../python'),
//     });

//     let output = '';
//     py.stdout.on('data', (d) => output += d.toString());
//     py.stderr.on('data', (err) => console.error('Python Error:', err.toString()));

//     py.on('close', () => {
//       try {
//         resolve(JSON.parse(output));
//       } catch {
//         reject('Failed to parse Python output');
//       }
//     });

//     py.stdin.write(JSON.stringify(input));
//     py.stdin.end();
//   });
// };






// // import { spawn } from 'child_process';

// // export const callPython = (script: string, payload: any): Promise<any[]> => {
// //   return new Promise((resolve, reject) => {
// //     const py = spawn('python3', [`python/${script}`]);

// //     let data = '';
// //     let error = '';

// //     py.stdout.on('data', (chunk) => {
// //       data += chunk.toString();
// //     });

// //     py.stderr.on('data', (chunk) => {
// //       error += chunk.toString();
// //     });

// //     py.on('close', (code) => {
// //       if (code !== 0) {
// //         return reject(new Error(`Python script failed: ${error}`));
// //       }
// //       try {
// //         const result = JSON.parse(data);
// //         resolve(result);
// //       } catch (e) {
// //         reject(new Error(`Failed to parse Python output: ${e.message}`));
// //       }
// //     });

// //     py.stdin.write(JSON.stringify(payload));
// //     py.stdin.end();
// //   });
// // };





// import { spawn } from 'child_process';
// import path from 'path';

// export const callPython = <T = any>(script: string, input: any): Promise<T> => {
//   return new Promise((resolve, reject) => {
//     const scriptPath = path.join(process.cwd(), 'src/python', script); // 👈 reliable path

//     const py = spawn('python3', [scriptPath]);

//     let output = '';
//     py.stdout.on('data', (d) => (output += d.toString()));
//     py.stderr.on('data', (err) => console.error('Python Error:', err.toString()));

//     py.on('close', () => {
//       try {
//         resolve(JSON.parse(output));
//       } catch {
//         reject('❌ Failed to parse Python output');
//       }
//     });

//     py.stdin.write(JSON.stringify(input));
//     py.stdin.end();
//   });
// };



// import { spawn } from 'child_process';
// import path from 'path';

// export const callPython = <T = any>(script: string, input: any): Promise<T> => {
//   const scriptPath = path.join(process.cwd(), 'src/python', script);

//   return new Promise((resolve, reject) => {
//     const py = spawn('/Library/Frameworks/Python.framework/Versions/3.13/bin/python3', [scriptPath]);

//     let output = '';
//     let error = '';

//     py.stdout.on('data', (d) => output += d.toString());
//     py.stderr.on('data', (err) => error += err.toString());

//     py.on('close', () => {
//       if (error) {
//         console.error('Python Error:', error);
//         return reject('❌ Failed to parse Python output');
//       }
//       try {
//         resolve(JSON.parse(output));
//       } catch (e:any) {
//         reject('❌ Failed to parse Python output : ' + e.message);
//       }
//     });

//     py.stdin.write(JSON.stringify(input));
//     py.stdin.end();
//   });
// };








import { spawn } from 'child_process';
import path from 'path';

export const callPython = <T = any>(script: string, input: any): Promise<T> => {
  const scriptPath = path.join(process.cwd(), 'src/python', script);

  return new Promise((resolve, reject) => {
    // const py = spawn('/Library/Frameworks/Python.framework/Versions/3.13/bin/python3', [scriptPath]);

    // const isLocal = process.env.NODE_ENV !== "production";
    // const pythonPath = isLocal
    //   ? "/Library/Frameworks/Python.framework/Versions/3.13/bin/python3"
    //   : "python3";

    const py = spawn("/Library/Frameworks/Python.framework/Versions/3.13/bin/python3", [scriptPath]);

    

    let output = '';
    let error = '';

    py.stdout.on('data', (d) => output += d.toString());
    py.stderr.on('data', (err) => error += err.toString());

    py.on('close', (code) => {
      if (error) {
        console.warn('⚠️ Python stderr:', error); // ⚠️ Log stderr instead of treating it as error
      }

      if (code !== 0) {
        console.error('❌ Python process exited with code:', code);
        return reject('❌ Python script exited with error');
      }

      try {
        console.log('📦 Python stdout:', output);
        resolve(JSON.parse(output));
      } catch (e: any) {
        reject('❌ Failed to parse Python output: ' + e.message);
      }
    });

    py.stdin.write(JSON.stringify(input));
    py.stdin.end();
  });
};
