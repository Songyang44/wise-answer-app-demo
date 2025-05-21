import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  SetFileName,
  StartUpload,
  UploadFailure,
  UploadSuccess,
} from "../slices/create-slice";
import { uploadToS3 } from "../slices/uploadToS3";

export default function CreateWorkSpaceCard() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Intern/Graduate", value: "intern" },
    { label: "Junior", value: "junior" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Senior", value: "senior" },
  ]);
  const dispatch = useAppDispatch();
  const { uploading, fileUrl, error, fileName } = useAppSelector(
    (state: any) => state.create
  );

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        dispatch(SetFileName(file.name));
        dispatch(StartUpload());

        await uploadToS3(
          file.uri,
          file.name,
          file.mimeType || "application/octet-stream"
        );

        dispatch(UploadSuccess(file.uri));
      }
    } catch (err: any) {
      dispatch(UploadFailure(err.message));
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your offers are coming!</Text>

      <TextInput placeholder="Name" style={styles.input} />
      <TextInput placeholder="Salary" style={styles.input} />

      <TextInput placeholder="Company Description" style={styles.input} />
      <TextInput placeholder="Job Description" style={styles.input} />
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Job Level"
        placeholderStyle={{ color: "rgb(0, 0, 0)" }}
        dropDownContainerStyle={{ backgroundColor: "rgb(255, 255, 255)" }}
        style={styles.dropdown}
        textStyle={{ color: "rgba(0, 0, 0, 0.77)" }}
        ArrowDownIconComponent={() => (
          <Entypo name="chevron-down" size={24} color="black" />
        )}
        ArrowUpIconComponent={() => (
          <Entypo name="chevron-up" size={24} color="black" />
        )}
      />

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handlePickDocument}
      >
        <AntDesign
          name="clouduploado"
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.uploadText}>{fileName ? (fileName):("Upload Your Resume")}</Text>
        {fileName && !uploading && !fileUrl && !error && (
          <Text style={{ color: "black", marginTop: 10 }}>
            Uploaded File: {fileName}
          </Text>
        )}

        {uploading ? (
          <Text style={{ color: "orange", marginTop: 6 }}>Uploading</Text>
        ) : error ? (
          <Text style={{ color: "red", marginTop: 6 }}>😢: {error}</Text>
        ) : fileUrl ? (
          <Text style={{ color: "green", marginTop: 6 }}> 🤗</Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    margin: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    color: "black",
    marginBottom: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  input: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    color: "rgba(0,0,0,0)",
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdown: {
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 12,
    marginBottom: 12,
    borderColor: "rgba(0,0,0,0)",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(14, 236, 240, 0.93)",
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  uploadText: {
    color: "rgb(255, 255, 255)",
    fontSize: 16,
  },
});
