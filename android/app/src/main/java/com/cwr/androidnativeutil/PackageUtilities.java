package com.cwr.androidnativeutil;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class PackageUtilities {

    @NonNull
    public static String JSON_Stringify(@NonNull ReadableMap readableMap) {
        JSONObject jsonObject = new JSONObject();
        try {
            ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                switch (readableMap.getType(key)) {
                    case Null -> jsonObject.put(key, JSONObject.NULL);
                    case Boolean -> jsonObject.put(key, readableMap.getBoolean(key));
                    case Number -> jsonObject.put(key, readableMap.getDouble(key));
                    case String -> jsonObject.put(key, readableMap.getString(key));
                    case Map -> jsonObject.put(key, JSON_Stringify(readableMap.getMap(key)));
                    case Array ->
                            jsonObject.put(key, readableArrayToJsonArray(readableMap.getArray(key)));
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject.toString();
    }

    @NonNull
    public static String JSON_Stringify(@NonNull Map<String, Object> map){
        JSONObject json = new JSONObject(map);
        return json.toString();
    }

    @NonNull
    public static JSONArray readableArrayToJsonArray(@NonNull ReadableArray readableArray) {
        JSONArray jsonArray = new JSONArray();
        try {
            for (int i = 0; i < readableArray.size(); i++) {
                switch (readableArray.getType(i)) {
                    case Null -> jsonArray.put(JSONObject.NULL);
                    case Boolean -> jsonArray.put(readableArray.getBoolean(i));
                    case Number -> jsonArray.put(readableArray.getDouble(i));
                    case String -> jsonArray.put(readableArray.getString(i));
                    case Map -> jsonArray.put(JSON_Stringify(readableArray.getMap(i)));
                    case Array ->
                            jsonArray.put(readableArrayToJsonArray(readableArray.getArray(i)));
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonArray;
    }

    @NonNull
    public static WritableMap JSON_Parse(@NonNull String jsonString) {
        WritableMap readableMap = Arguments.createMap();
        try {
            JSONObject jsonObject = new JSONObject(jsonString);
            Iterator<String> keys = jsonObject.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                Object value = jsonObject.get(key);
                if (value instanceof Boolean) {
                    readableMap.putBoolean(key, (Boolean) value);
                } else if (value instanceof Integer || value instanceof Double) {
                    readableMap.putDouble(key, ((Number) value).doubleValue());
                } else if (value instanceof String) {
                    try {
                        JSONObject nestedObject = new JSONObject((String) value);
                        readableMap.putMap(key, JSON_Parse(nestedObject.toString()));
                    } catch (JSONException e) {
                        readableMap.putString(key, (String) value);
                    }
                } else if (value instanceof JSONObject) {
                    readableMap.putMap(key, JSON_Parse(value.toString()));
                } else if (value instanceof JSONArray) {
                    readableMap.putArray(key, jsonArrayToWritableArray((JSONArray) value));
                } else if (value == JSONObject.NULL) {
                    readableMap.putNull(key);
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return readableMap;
    }

    @NonNull
    public static Map<String, Object> JSON_Map_Parse(@NonNull String jsonString) throws JSONException {
        Map<String, Object> map = new HashMap<>();
        try {
            JSONObject jsonObject = new JSONObject(jsonString);
            Iterator<String> keysIterator = jsonObject.keys();

            while (keysIterator.hasNext()) {
                String key = keysIterator.next();
                Object value = jsonObject.get(key);
                map.put(key, value);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return map;
    }

    @NonNull
    public static WritableArray jsonArrayToWritableArray(@NonNull JSONArray jsonArray) {
        WritableArray writableArray = Arguments.createArray();
        for (int i = 0; i < jsonArray.length(); i++) {
            try {
                Object value = jsonArray.get(i);
                if (value instanceof Boolean) {
                    writableArray.pushBoolean((Boolean) value);
                } else if (value instanceof Integer || value instanceof Double) {
                    writableArray.pushDouble(((Number) value).doubleValue());
                } else if (value instanceof String) {
                    writableArray.pushString((String) value);
                } else if (value instanceof JSONObject) {
                    writableArray.pushMap(JSON_Parse(value.toString()));
                } else if (value instanceof JSONArray) {
                    writableArray.pushArray(jsonArrayToWritableArray((JSONArray) value));
                } else if (value == JSONObject.NULL) {
                    writableArray.pushNull();
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return writableArray;
    }
}
