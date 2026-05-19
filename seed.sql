-- Default seed data — categories, subcategories, accounts with icons
-- Safe to re-run: INSERT OR IGNORE skips existing rows
-- Run: npx wrangler d1 execute YOUR-DB-NAME --file seed.sql --remote

-- ── Categories ──────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-816b-a284-cff74f3c5129','Apparel','👕',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-8134-a0ad-e51aab9f7206','Beauty','💄',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-8147-ad11-f9d7cf1c9da6','Culture','🎭',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-81dc-8972-d7e8c11192ad','Education','📚',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3444b5c9-ab71-80fe-b1c1-c1264b55a67a','Entertainment','📺',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-815c-96ce-c0c16623be7c','Food','🍽️',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-8104-aca5-d2e2774e986e','Gift','🎁',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-81dd-b80b-f5be971cdabc','Health','🏥',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-81b4-b891-eb55497bdef5','Holiday','✈️',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-8110-99f8-c499afb2abe4','Household','🏠',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3434b5c9-ab71-80a1-8e96-fe8a6e893a4c','Investment','📈',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3434b5c9-ab71-8048-88d1-df388ebd0afa','Miscellaneous','',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3444b5c9-ab71-80ae-b52d-e2a5200fda5d','Money Transfer','',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-8163-a9e6-cf07c53b8f8d','Other','📦',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-8164-94d2-dd571029f348','Salary','💰',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3434b5c9-ab71-80ae-916e-d05ab865424e','Shopping','🛍️',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-81ad-a81c-ec29ac0c3fc8','Social Life','🎉',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-8178-ba50-fc8285bb89ac','Subscription','🔄',NULL,'expense');
INSERT OR IGNORE INTO categories(id,name,emoji,icon_url,type) VALUES('3414b5c9-ab71-81fb-9287-e5d304a24d0b','Transport','🚗',NULL,'expense');

-- ── Subcategories ────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3514b5c9-ab71-8143-82d6-f8d74fec13bf','amazon','3414b5c9-ab71-8110-99f8-c499afb2abe4','brand:amazon');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-8116-8afc-e1110de007c6','Appliances','3414b5c9-ab71-8110-99f8-c499afb2abe4','lucide:laptop');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-8154-a113-d33acd3acb3e','Beverages','3414b5c9-ab71-815c-96ce-c0c16623be7c','lucide:coffee');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3434b5c9-ab71-80b2-aa7b-fde1302d6fe5','Blinkit','3414b5c9-ab71-8110-99f8-c499afb2abe4','brand:blinkit');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81f7-9a14-d0bf7365d11f','Cab','3414b5c9-ab71-81fb-9287-e5d304a24d0b','lucide:car');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-8106-9785-ebaf9e39718f','Clothing','3434b5c9-ab71-80ae-916e-d05ab865424e','lucide:shirt');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-8106-aca9-e5f542d1cc26','Cloud','3414b5c9-ab71-8163-a9e6-cf07c53b8f8d',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81b8-b9a4-fb24c30b868d','Cosmetics','3414b5c9-ab71-8134-a0ad-e51aab9f7206',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81b4-88c6-e94d955487e5','Country Delight','3414b5c9-ab71-8110-99f8-c499afb2abe4','brand:countrydelight');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81d5-b114-cc5bb9b18b65','Dinner','3414b5c9-ab71-815c-96ce-c0c16623be7c','lucide:utensils');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-8147-9ea1-fee80fb82e1a','Donation','3414b5c9-ab71-8163-a9e6-cf07c53b8f8d',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81ce-ba6d-f63c9590512c','Eating out','3414b5c9-ab71-815c-96ce-c0c16623be7c','lucide:apple');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('34b4b5c9-ab71-80bd-9097-e5681b82e3d2','Entertainment','3414b5c9-ab71-8178-ba50-fc8285bb89ac','lucide:film');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-819f-8a0c-e0b8ff7f374b','Fruits','3414b5c9-ab71-8110-99f8-c499afb2abe4','lucide:apple');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81b0-8b00-e9ee258cadc4','Fuel','3414b5c9-ab71-81fb-9287-e5d304a24d0b',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-817a-8b78-f0d291b9602c','Grocery','3414b5c9-ab71-8110-99f8-c499afb2abe4',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81bd-9efe-e55ddf07fbf9','Haircut','3414b5c9-ab71-81dd-b80b-f5be971cdabc',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3444b5c9-ab71-800a-8b7b-fad7ee392a68','instamart','3414b5c9-ab71-8110-99f8-c499afb2abe4','brand:instamart');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81df-a806-e500d9fb3284','Kitchen','3414b5c9-ab71-8110-99f8-c499afb2abe4',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81a5-b7f8-f557beb467a0','Lunch','3414b5c9-ab71-815c-96ce-c0c16623be7c',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-8165-bd53-ce0f6f4e48cb','Medicine','3414b5c9-ab71-81dd-b80b-f5be971cdabc',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81da-afdd-ee405ac839f0','Metro','3414b5c9-ab71-81fb-9287-e5d304a24d0b',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81f7-901d-d8afe6c47b20','Mobile Recharge','3414b5c9-ab71-8178-ba50-fc8285bb89ac',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-815b-9f3f-d4340aa01a65','Movie','3414b5c9-ab71-8147-ad11-f9d7cf1c9da6',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81e5-9a80-e7319650af9c','Salary','3414b5c9-ab71-8164-94d2-dd571029f348',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81ce-a752-d6e839292b2a','School supplies','3414b5c9-ab71-81dc-8972-d7e8c11192ad',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-8111-9aa1-f56a27d1bcf4','Snacking','3414b5c9-ab71-815c-96ce-c0c16623be7c','lucide:pizza');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-8179-8bc5-da0e5ebc1d79','Stay','3414b5c9-ab71-81b4-b891-eb55497bdef5','lucide:home');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3444b5c9-ab71-80f2-a621-f769e947dade','Swiggy','3414b5c9-ab71-815c-96ce-c0c16623be7c','brand:swiggy');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-8187-ba7f-fd942487b108','Tax','3414b5c9-ab71-81fb-9287-e5d304a24d0b',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81db-ac6e-eae8f2b3cdff','Travel','3414b5c9-ab71-81b4-b891-eb55497bdef5','lucide:plane');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3494b5c9-ab71-80f2-8600-f501c93f473e','Utility','3414b5c9-ab71-8163-a9e6-cf07c53b8f8d','lucide:settings');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81ec-bed3-fe19b12d41f4','Vegetables','3414b5c9-ab71-8110-99f8-c499afb2abe4',NULL);
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3414b5c9-ab71-81d4-8c02-e7487da111b9','Wifi','3414b5c9-ab71-8178-ba50-fc8285bb89ac','lucide:banknote');
INSERT OR IGNORE INTO subcategories(id,name,category_id,icon_url) VALUES('3444b5c9-ab71-8099-8d3e-decb0c1c264a','zepto','3414b5c9-ab71-8110-99f8-c499afb2abe4','brand:zepto');

-- ── Accounts ─────────────────────────────────────────────────────────────────
INSERT OR IGNORE INTO accounts(id,name,emoji,icon_url) VALUES('3434b5c9-ab71-806b-8e10-e0b035de63a5','Axis Flipkart','','bank:axis');
INSERT OR IGNORE INTO accounts(id,name,emoji,icon_url) VALUES('3414b5c9-ab71-81bc-845b-f06e2a621ba8','BOB','','bank:bob');
INSERT OR IGNORE INTO accounts(id,name,emoji,icon_url) VALUES('3414b5c9-ab71-8179-bf7a-fb7cb9989c64','Cash','💵',NULL);
INSERT OR IGNORE INTO accounts(id,name,emoji,icon_url) VALUES('3d89888c-d2e6-49a8-b4bc-c15f4a8d6281','Cash','','bank:cash');
INSERT OR IGNORE INTO accounts(id,name,emoji,icon_url) VALUES('3414b5c9-ab71-815a-b6b5-f5921b8178cd','Cred wallet','','bank:cred');
INSERT OR IGNORE INTO accounts(id,name,emoji,icon_url) VALUES('3514b5c9-ab71-8167-b5ed-eba0696ee4dc','ICICI Bank','','bank:icici');
INSERT OR IGNORE INTO accounts(id,name,emoji,icon_url) VALUES('3414b5c9-ab71-81ce-9304-c3a7824596d0','ICICI CORAL','','bank:icici');
INSERT OR IGNORE INTO accounts(id,name,emoji,icon_url) VALUES('3414b5c9-ab71-8134-a4d3-fbecacb37025','ICICI MMT','','bank:icici');
INSERT OR IGNORE INTO accounts(id,name,emoji,icon_url) VALUES('3414b5c9-ab71-8179-a306-e7fbb6f52c18','ICICI MMT R','','bank:icici');
INSERT OR IGNORE INTO accounts(id,name,emoji,icon_url) VALUES('3414b5c9-ab71-8129-9883-ddd855d639ae','SBI','','bank:sbi');
INSERT OR IGNORE INTO accounts(id,name,emoji,icon_url) VALUES('3414b5c9-ab71-8100-a9b8-d06b09deb217','YES BANK I','','bank:yes');
INSERT OR IGNORE INTO accounts(id,name,emoji,icon_url) VALUES('3414b5c9-ab71-8145-a7da-f99d655d08db','YES BANK R','','bank:yes');
