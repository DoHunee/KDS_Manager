import { StatusBar } from "expo-status-bar";
import {  StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "./refs/colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { AuthProvider, useAuth } from './AuthContext'; // AuthProvider 추가

import Orders from "./screens/Orders";
import Current from "./screens/Current";
import Complete from "./screens/Complete";
import Schedule from "./screens/Schedule";
import Manager from "./screens/Manager";
import Fix from "./screens/Fix";

import LoginScreen from "./screens/LoginScreen"; // 추가된 부분



const Tab = createMaterialBottomTabNavigator();  //하단 네비게이션 탭 생성 
const Stack = createNativeStackNavigator();  //스택 네비게이터

export default function App() {
    const HomeStack = () => {
    const { isLoggedIn } = useAuth(); // useAuth 훅 사용
    
    return (
      <Stack.Navigator initialRouteName={isLoggedIn ? "orders" : "Login"}>
        {/* "Login" 화면을 나타내는 Stack.Screen */}
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
        
        {/* "orders" 화면을 나타내는 Stack.Screen */}
        <Stack.Screen
          options={{ headerShown: false }}
          name="orders"
          component={Orders}
        />

        {/* "Manager" 화면을 나타내는 Stack.Screen */}
         {isLoggedIn && (
          <Stack.Screen
            options={{ headerShown: false }}
            name="manager"
            component={Manager}
          />
        )}
         
         {/* "Fix" 화면을 나타내는 Stack.Screen */}
        <Stack.Screen
          options={{ headerShown: false }}
          name="fix"
          component={Fix}
        />

      </Stack.Navigator>
    );
  };
  

   return (
    // 리액트 앱에서 Redux 스토어를 제공하기 위해 사용됩니다
    <Provider store={store}>
    <NavigationContainer>   
      <AuthProvider>
        <StatusBar style="white" />  
        
        {/* 하단 탭 네비게이터을 클릭했을때 색 */}
        <Tab.Navigator      
          activeColor={"black"}  //선택한 아이콘
          inactiveColor={"black"}  // 선택하지 않은 아이콘 
          barStyle={{ backgroundColor: "skyblue" }} // 배경
        >  
          <Tab.Screen
            options={{
              tabBarLabel: "접수대기",
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons
                  name="clipboard-list-outline"
                  color={focused ? colors.secondary : color}
                  size={26}
                />
              ),
            }}
            name="homeStack"
            component={HomeStack}
          />
          <Tab.Screen
            options={{
              tabBarLabel: "접수완료",
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons
                  name="bell-ring-outline"
                  color={focused ? colors.secondary : color}
                  size={26}
                />
              ),
            }}
            name="current"
            component={Current}
          />

          <Tab.Screen
            options={{
              tabBarLabel: "처리완료",
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons
                  name="checkbox-marked-circle-outline"
                  color={focused ? colors.secondary : color}
                  size={26}
                />
              ),
            }}
            name="complete"
            component={Complete}
          />

          <Tab.Screen
            options={{
              tabBarLabel: "매출",
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons
                  name="timetable"
                  color={focused ? colors.secondary : color}
                  size={26}
                />
              ),
            }}
            name="schedule"
            component={Schedule}
          />

          <Tab.Screen
            options={{
              tabBarLabel: "관리자",
              tabBarIcon: ({ color, focused }) => (
                <MaterialCommunityIcons
                  name="account-plus-outline"
                  color={focused ? colors.secondary : color}
                  size={26}
                />
              ),
            }}
            name="manager"
            component={Manager}
          />
        </Tab.Navigator>
      </AuthProvider>
    </NavigationContainer>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});