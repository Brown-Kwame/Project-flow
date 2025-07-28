import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const _layout = () => {
  return (
    <Tabs
      screenOptions={
        ({ route }) => ({
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopWidth: 0,
            height: 70,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 18,
          },
          tabBarIcon: ({ focused, color }) => {
            let IconName: any;
            let label = "";
            if (route.name === "index") {
              IconName = "home";
              label = "Home";
            } else if (route.name === "contacts") {
              IconName = "people";
              label = "Contacts";
            } else if (route.name === "calls") {
              IconName = "call";
              label = "Calls";
            } else if (route.name === "chats") {
              IconName = "chatbubbles";
              label = "Chats";
            } else if (route.name === "settings") { // <-- ADDED THIS BLOCK
              IconName = "settings";
              label = "Settings";
            }

            // A small guard to prevent rendering an icon for a route we haven't defined
            if (!IconName) {
              return null;
            }

            return (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: 999,
                  justifyContent: "center",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  marginTop: 10,
                  gap: 6,
                  width: 90, // Adjusted width slightly to fit 5 tabs
                  height: 40,
                }}
              >
                <Ionicons name={IconName} size={24} color={focused ? "rgb(40, 144, 241)" : color} />
                <Text style={{ color: focused ? "rgb(40, 144, 241)" : color, fontSize: 12 }}>
                  {label}
                </Text>
              </View>
            );
          }
        })
      }
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: "Contacts",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="calls"
        options={{
          title: "Calls",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          headerShown: false,
        }}
      />
      {/* ADDED THIS NEW SCREEN TO THE TABS */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default _layout;