
import React from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = {primary: '#1f145c', white: '#fff'};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isDark, setIsDark] = React.useState(isDarkMode);

  const [textInput, setTextInput] = React.useState('')
  const [todos, setTodos] = React.useState([]);

  React.useEffect(()=> {
    getData();
  }, []);

  React.useEffect(()=> {
    storeData(todos);
  }, [todos]);

  const ListItem = ({todo}) => {
    return(
      <View style = {styles.listItem}>
        <View style = {{flex: 1}}>
          <Text style = {{
            fontWeight: 'bold',
            fontSize: 15,
            color: COLORS.primary,
            textDecorationLine: todo?.completed ? 'line-through' : "none"
            }}>
              {todo?.task}
            </Text>
        </View>
        {
          !todo?.completed && (
            <TouchableOpacity style = {styles.actionIcon} onPress = {()=>markTodoComplete(todo?.id)}>
              <MaterialCommunityIcons name="check" size={15} color={COLORS.white} />
            </TouchableOpacity>
          )
        }

        <TouchableOpacity style = {[styles.actionIcon, {backgroundColor: 'red'}]} onPress={() => deleteTodo(todo?.id)}>
          <MaterialCommunityIcons name="delete" size={15} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };

  const addTodo = () => {
    console.log(textInput);
    if(textInput == ''){
      Alert.alert('Error', 'Please input todo');
    }else{
      const newTodo = {
      id: Math.random(),
      task: textInput,
      completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  const markTodoComplete = (todoId) => {
    const newTodos = todos.map((item) => {
        if (item.id == todoId){
            return {...item, completed: true};
        }
        return item;
    });
    setTodos(newTodos);
};

const deleteTodo = (todoId) => {
  const newTodos = todos.filter((item) => item.id != todoId);
  setTodos(newTodos);
};

const clearTodo = () => {
  Alert.alert('Confirm', 'Clear Todos?',[
    {
      text: 'Yes',
      onPress: () => setTodos([]),
    },
    {
      text: 'No'
    }
  ]);

};

const storeData = async (todos) => {
  try {
    const jsonValue  = JSON.stringify(todos);
    await AsyncStorage.setItem('todos', jsonValue );
  } catch (e) {
    console.log(e);
  }
};


const getData = async () => {
  try {
    const todos = await AsyncStorage.getItem('todos');
    if (todos != null) { 
      setTodos(JSON.parse(todos))};
  } catch(e) {
    console.log(Error);
  }
};

  return(
    <SafeAreaView style = {{flex: 1, backgroundColor: isDark ? 'black' : 'white'}}>
      <View style = {styles.header}>
        <Text style = {{fontWeight: 'bold', fontSize: 20, color: isDark ? 'white' : 'black'}}>TODO APP</Text>
        <Switch value={isDark} onValueChange={val => setIsDark(val)}/>
        <MaterialCommunityIcons name="delete" size={25} color="red" onPress={clearTodo}/>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item}/> }
      />
      <View style = {[styles.footer, {backgroundColor: isDark ? 'black' : 'white'}]}>
        <View style = {styles.inputContainer}>
          <TextInput
            placeholder='Add TODO'
            onChangeText={setTextInput}
            value={textInput}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style = {styles.iconContainer}>
          <MaterialCommunityIcons name="plus" size={35} color={COLORS.white} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  footer: {
    position: 'absolute',
    bottom: 1,
    backgroundColor: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    marginRight: 10,
    borderRadius: 25,
    elevation: 40,
    alignItems: "center",
    justifyContent: 'center'
  },
  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3
  }
});
export default App;
