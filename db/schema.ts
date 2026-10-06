import {integer,real,sqliteTable,text,index} from 'drizzle-orm/sqlite-core';
export const gameSaves=sqliteTable('game_saves',{
 id:text('id').primaryKey(),userId:text('user_id').notNull(),kind:text('kind').notNull(),savedAt:text('saved_at').notNull(),crystals:integer('crystals').notNull(),placed:integer('placed').notNull(),best:real('best'),objectKey:text('object_key').notNull(),
},table=>[index('idx_game_saves_user_time').on(table.userId,table.savedAt)]);
