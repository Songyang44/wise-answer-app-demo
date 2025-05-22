import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  ScrollView,
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
import { addQuestion, updateQuestion,setQuestions } from "../slices/interview-question-slice";
import { uploadToS3 } from "../slices/uploadToS3";
import { ResetForm, SetField } from "../slices/workspace-slice";

export default function CreateWorkSpaceCard() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Intern/Graduate", value: "intern" },
    { label: "Junior", value: "junior" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Senior", value: "senior" },
  ]);
  const [showQuestions, setShowQuestions] = useState(false);
  const questions = useAppSelector((state) => state.interviewquestion);
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { uploading, fileUrl, error, fileName } = useAppSelector(
    (state: any) => state.create
  );
  const { salary, jobDescription, companyDescription } = useAppSelector(
    (state: any) => state.workspace
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

  const handleSubmit = async () => {
    setSubmitting(true);
  
    try {
      const response = await axios.post("https://BACKEND_API_URL/generateQuestions", {
        salary,
        jobDescription,
        companyDescription,
        level: value,
        fileUrl,
      });
  
      const aiQuestions = response.data.questions || []; 
      dispatch(setQuestions(aiQuestions));
      setShowQuestions(true);
    } catch (error) {
      Alert.alert("Error", "Failed to generate questions.");
    } finally {
      setSubmitting(false);
    }
  };

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Exit", "Save draft or exit?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Save as draft",
            onPress: () => navigation.goBack(),
          },
          {
            text: "Exit",
            style: "destructive",
            onPress: () => {
              dispatch(ResetForm());
              navigation.goBack();
              setShowQuestions(false);
            },
          },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => backHandler.remove();
    }, [navigation])
  );

  return (
    <>
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.title}>Your offers are coming!</Text>
          <TextInput
            placeholder="Salary"
            style={styles.input}
            value={salary}
            onChangeText={(text) =>
              dispatch(SetField({ key: "salary", value: text }))
            }
          />

          <TextInput
            placeholder="Company Description"
            style={styles.input}
            value={companyDescription}
            onChangeText={(text) =>
              dispatch(SetField({ key: "companyDescription", value: text }))
            }
          />
          <TextInput
            placeholder="Job Description"
            style={styles.input}
            value={jobDescription}
            onChangeText={(text) =>
              dispatch(SetField({ key: "jobDescription", value: text }))
            }
          />
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
            <Text style={styles.uploadText}>
              {fileName ? fileName : "Upload Your Resume"}
            </Text>
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
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text>Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              setShowQuestions(true);
              handleSubmit();
              // TODO: call API endpoint
            }}
          >
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
        {showQuestions && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>Interview Questions</Text>
            <FlatList
              data={questions.questions}
              nestedScrollEnabled
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <Text style={styles.questionText}>
                  {index + 1}. {item.text}
                </Text>
              )}
            />
          </View>
        )}
      </ScrollView>
    </>
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
    color: "rgb(0, 0, 0)",
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
    zIndex:9999
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: "rgb(150, 230, 232)",
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    width: 120,
    alignItems: "center",
  },
  questionContainer: {
    marginTop: 30,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  questionText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
});
