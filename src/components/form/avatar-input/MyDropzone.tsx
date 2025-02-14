import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function MyDropzone() {
    const onDrop = useCallback((acceptedFiles: any) => {
      // Fai qualcosa con i file accettati
      console.log(acceptedFiles);
    }, []);
  
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  
    return (
      <div {...getRootProps()}>
        PIPPO
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Trascina qui i file...</p> :
            <p>Trascina i file qui, oppure clicca per selezionarli</p>
        }
      </div>
    );
  }

  export default MyDropzone