import { useEffect, useState } from "react";

function App({ functionName }) {
  const [imageUrl, setImageUrl] = useState("");
  const [lastFolderName, setLastFolderName] = useState("");
  
  useEffect(() => {
    if (!functionName) return;

    let relativePath = functionName.replace(/^.*?(CameraFails)/, "$1");
  relativePath = relativePath.replace(/\\/g, "/");
  const basePath = "C:/" + relativePath;
  const parts = functionName.split(/[/\\]/);
 
   const lastFolder = parts[parts.length - 1];

  setLastFolderName(lastFolder);


    const fetchImage = () => {
     
      fetch("http://localhost:5000/latest-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: basePath }),
      })
        .then((res) => {
          
          if (!res.ok) throw new Error("Image not found");
          return res.blob();
        })
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setImageUrl("");
        });
    };

   
    fetchImage();
    const interval = setInterval(fetchImage, 1000); 

    return () => clearInterval(interval); 
  }, [functionName]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Latest Image from Folder :{lastFolderName}</h1>
     
      {imageUrl ? (
        <img src={imageUrl} alt="Latest" className=" border rounded" />
      ) : (
        <p className="text-red-500">Loading.</p>
      )}
    </div>
  );
}

export default App;
