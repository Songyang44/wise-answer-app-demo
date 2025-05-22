import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import uuid from 'react-native-uuid';
import { useAppSelector,useAppDispatch } from '../hooks/hooks';
import { RootState } from '../store/store';
import { addQuestion, updateQuestion,reorderQuestions } from '../slices/interview-question-slice';

type Question = {
  id: string;
  text: string;
};

const defaultQuestions: Question[] = [
  { id: '1', text: 'Can you tell me about yourself?' },
  { id: '2', text: 'Why do you want to work here?' },
  { id: '3', text: 'What are your strengths and weaknesses?' },
  { id: '4', text: 'Where do you see yourself in 5 years?' },
];

export default function InterviewQuestionsEditor() {
  const questions = useAppSelector((state: RootState) => state.interviewquestion.questions);
const answers = useAppSelector((state: RootState) => state.interviewquestion.answers);
const dispatch = useAppDispatch();

  const handleAddQuestion = () => {
   dispatch(addQuestion());
  };

  const handleEditQuestion = (id: string, newText: string) => {
    dispatch(updateQuestion({id,text:newText}))
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Question>) => (
    <TouchableOpacity
      style={[styles.item, isActive && styles.activeItem]}
      onLongPress={drag}
      delayLongPress={150}
      activeOpacity={0.8}
    >
      <TextInput
        value={item.text}
        onChangeText={text => handleEditQuestion(item.id, text)}
        style={styles.input}
        placeholder="Edit question"
        multiline
      />
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <DraggableFlatList
        data={questions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        onDragEnd={({ data }) => {dispatch(reorderQuestions(data))}}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
        <Text style={styles.addButtonText}>Add Question</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  list: {
    paddingBottom: 80,
  },
  item: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  activeItem: {
    backgroundColor: '#2a6ebd',
  },
  input: {
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#FF7F50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
