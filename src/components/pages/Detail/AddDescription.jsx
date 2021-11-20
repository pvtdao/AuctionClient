import React, { useState } from "react";
import EditorField from "../../../feature/Seller/components/CreatePost/Editor";
import axios from "axios";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../../redux/actions/loadingAction";
import { useParams } from "react-router";

function AddDescription({ onCancel, handleAddDescription }) {
  const [prodDescription, setProdDescription] = useState("");
  let { prodId } = useParams();

  prodId = parseInt(prodId);

  function handleCancel() {
    if (onCancel) {
      onCancel(false);
    }
  }

  function getDetailEditor(description) {
    setProdDescription(description);
  }

  async function handleSubmit() {
    if (!handleAddDescription) return;
    handleAddDescription(prodDescription, prodId);
  }

  return (
    <div className="detail__description-add">
      <p>Thêm mô tả</p>
      <EditorField onEditorStateChange={getDetailEditor} />
      <div className="detail__description-action">
        <button
          className="detail__description-action--submit"
          onClick={handleSubmit}
        >
          Thêm mô tả
        </button>
        <button
          className="detail__description-action--cancel"
          onClick={handleCancel}
        >
          Hủy
        </button>
      </div>
    </div>
  );
}

export default AddDescription;
