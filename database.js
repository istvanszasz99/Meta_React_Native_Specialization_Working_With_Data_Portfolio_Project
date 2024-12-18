import * as SQLite from "expo-sqlite";
import { SECTION_LIST_MOCK_DATA } from "./utils";

const db = SQLite.openDatabase("little_lemon");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists menuitems (id integer primary key not null, uuid text, title text, price text, category text);"
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("select * from menuitems", [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
  tx.executeSql(`insert into menuitems (uuid, title, price, category) values ${menuItems.map((item) =>`('${item.id}', '${item.title}', '${item.price}', '${item.category}')`).join(", ")}`);
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      let sql = 'select * from menuitems where title like ?';
      let queryData = ['%' + query + '%'];

      if (activeCategories.length > 0) {
        sql += ' and category in (' + new Array(activeCategories.length).fill('?').join(',') + ')';
        queryData = queryData.concat(activeCategories);
      }

      tx.executeSql(sql, queryData, (_, { rows }) => {
        resolve(rows._array);
      }, (error) => {
        reject(error);
      });
    });
  });
}