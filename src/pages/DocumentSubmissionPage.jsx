import { useState } from "react";
import { DOC_TYPE_LIST } from "../configs/constants";
import DocForm from "../components/forms/DocForms";

export default function DocumentSubmissionPage() {
  const [activeType, setActiveType] = useState(DOC_TYPE_LIST[0]);

  return (
    <div>
      <h2>Submit Document</h2>

      <div>
        {DOC_TYPE_LIST.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            style={{
              fontWeight: activeType === type ? "bold" : "normal",
              marginRight: "8px",
            }}
          >
            {type.replace("_", " ")}
          </button>
        ))}
      </div>

      <hr />
      <DocForm docType={activeType} />
    </div>
  );
}
