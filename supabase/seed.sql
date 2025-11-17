SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict k7WX47e1H6afBp4t9Cu5yPwZooCVHdFZLJtXlKV3NI7JATAfXGCjccSPyzqOvZ5

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'da843818-fa5b-4ad9-aa42-67c7e913f119', 'authenticated', 'authenticated', 'martin.soucy-rancourt@hec.ca', '$2a$10$qlQ8lFR/xFHwwqBlNFePjOXJOIGhw6lI7HqO8qDMK89AKlFvlI8g2', '2025-11-16 20:16:48.745211+00', NULL, '', '2025-11-16 20:16:27.46881+00', '', NULL, '', '', NULL, '2025-11-16 20:21:37.035661+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "da843818-fa5b-4ad9-aa42-67c7e913f119", "email": "martin.soucy-rancourt@hec.ca", "email_verified": true, "phone_verified": false}', NULL, '2025-11-16 20:16:27.461774+00', '2025-11-17 11:13:57.874097+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '375e074a-cc20-4a8e-96a6-502439162c48', 'authenticated', 'authenticated', 'rastamart.com@gmail.com', NULL, '2025-11-16 20:15:56.408625+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-11-16 20:21:23.771738+00', '{"provider": "google", "providers": ["google"]}', '{"iss": "https://accounts.google.com", "sub": "100330843032087850377", "name": "Martin Rancourt", "email": "rastamart.com@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocIVUtj_q2524VpJZ2XGR7Hgmm4t8YMpidUN4PLl82YBnFrw0nO7=s96-c", "full_name": "Martin Rancourt", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocIVUtj_q2524VpJZ2XGR7Hgmm4t8YMpidUN4PLl82YBnFrw0nO7=s96-c", "provider_id": "100330843032087850377", "email_verified": true, "phone_verified": false}', NULL, '2025-11-16 20:15:56.383371+00', '2025-11-16 20:21:23.774196+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('da843818-fa5b-4ad9-aa42-67c7e913f119', 'da843818-fa5b-4ad9-aa42-67c7e913f119', '{"sub": "da843818-fa5b-4ad9-aa42-67c7e913f119", "email": "martin.soucy-rancourt@hec.ca", "email_verified": true, "phone_verified": false}', 'email', '2025-11-16 20:16:27.46405+00', '2025-11-16 20:16:27.464107+00', '2025-11-16 20:16:27.464107+00', '16874d74-d466-4754-a2c4-ffa1d1026f82'),
	('100330843032087850377', '375e074a-cc20-4a8e-96a6-502439162c48', '{"iss": "https://accounts.google.com", "sub": "100330843032087850377", "name": "Martin Rancourt", "email": "rastamart.com@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocIVUtj_q2524VpJZ2XGR7Hgmm4t8YMpidUN4PLl82YBnFrw0nO7=s96-c", "full_name": "Martin Rancourt", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocIVUtj_q2524VpJZ2XGR7Hgmm4t8YMpidUN4PLl82YBnFrw0nO7=s96-c", "provider_id": "100330843032087850377", "email_verified": true, "phone_verified": false}', 'google', '2025-11-16 20:15:56.399249+00', '2025-11-16 20:15:56.399295+00', '2025-11-16 20:21:22.964972+00', '3e777f2f-4b79-40dd-9d61-13f1ba50c9f7');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter") VALUES
	('22f9be8c-be94-4d4b-849d-5a829ae9591f', 'da843818-fa5b-4ad9-aa42-67c7e913f119', '2025-11-16 20:21:37.035753+00', '2025-11-17 11:13:57.913036+00', NULL, 'aal1', NULL, '2025-11-17 11:13:57.912936', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15', '172.226.16.69', NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('22f9be8c-be94-4d4b-849d-5a829ae9591f', '2025-11-16 20:21:37.038404+00', '2025-11-16 20:21:37.038404+00', 'password', 'feb3b3f3-e32d-4371-9151-51a32bfb5691');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 4, 'ubx6z6jcjjf7', 'da843818-fa5b-4ad9-aa42-67c7e913f119', true, '2025-11-16 20:21:37.037053+00', '2025-11-16 21:19:54.065744+00', NULL, '22f9be8c-be94-4d4b-849d-5a829ae9591f'),
	('00000000-0000-0000-0000-000000000000', 5, 'rqzkvkliln5c', 'da843818-fa5b-4ad9-aa42-67c7e913f119', true, '2025-11-16 21:19:54.080535+00', '2025-11-17 11:13:57.82996+00', 'ubx6z6jcjjf7', '22f9be8c-be94-4d4b-849d-5a829ae9591f'),
	('00000000-0000-0000-0000-000000000000', 6, 'rnuzvtm7qfpn', 'da843818-fa5b-4ad9-aa42-67c7e913f119', false, '2025-11-17 11:13:57.857496+00', '2025-11-17 11:13:57.857496+00', 'rqzkvkliln5c', '22f9be8c-be94-4d4b-849d-5a829ae9591f');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "email", "is_admin", "created_at", "updated_at") VALUES
	('375e074a-cc20-4a8e-96a6-502439162c48', 'rastamart.com@gmail.com', false, '2025-11-16 20:20:11.102937+00', '2025-11-16 20:21:23.771585+00'),
	('da843818-fa5b-4ad9-aa42-67c7e913f119', 'martin.soucy-rancourt@hec.ca', true, '2025-11-16 20:20:11.102937+00', '2025-11-17 11:13:57.784812+00');


--
-- Data for Name: resource_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."resource_types" ("id", "name", "slug", "created_at") VALUES
	(1, 'Mentorat / coaching', 'mentorat-coaching', '2025-11-16 21:25:58.325814+00'),
	(2, 'Incubation & accélération', 'incubation-acceleration', '2025-11-16 21:25:58.325814+00'),
	(3, 'Formation & développement de compétences', 'formation-competences', '2025-11-16 21:25:58.325814+00'),
	(4, 'Réseautage & communauté', 'reseautage-communaute', '2025-11-16 21:25:58.325814+00'),
	(5, 'Conseils techniques ou sectoriels', 'conseils-techniques', '2025-11-16 21:25:58.325814+00'),
	(6, 'Support administratif / réglementaire', 'support-administratif', '2025-11-16 21:25:58.325814+00'),
	(7, 'Support au marketing / commercialisation / accès au marché', 'marketing-commercialisation', '2025-11-16 21:25:58.325814+00'),
	(8, 'Support technologique / numérique', 'support-technologique', '2025-11-16 21:25:58.325814+00'),
	(9, 'Support thématique ou pour groupes sous-représentés', 'support-thematique', '2025-11-16 21:25:58.325814+00'),
	(10, 'Accès aux infrastructures ou ressources physiques', 'infrastructures', '2025-11-16 21:25:58.325814+00'),
	(11, 'Soutien à l''innovation et recherche/développement (R&D)', 'innovation-rd', '2025-11-16 21:25:58.325814+00'),
	(12, 'Soutien global de croissance & planification stratégique', 'croissance-strategie', '2025-11-16 21:25:58.325814+00');


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."resources" ("slug", "nom", "type", "type_organisation", "localisation", "geographie", "geographie2", "site", "secteur", "modalite", "services", "public_cible", "contacts", "autres", "supports", "meta_description", "image_url", "socials", "inserted_at", "updated_at", "deleted_at", "types") VALUES
	('c2mi-miqro-innovation', 'C2MI (MiQro Innovation)', 'Support technologique / numérique', 'PPP (gouvern. féd./prov.)', NULL, NULL, 'Bromont (QC)', 'https://c2mi.ca', 'Microélectronique, MEMS, semiconducteurs', 'Partenariat industriel (adhésion/contrat)', 'Laboratoires de prototypage haute technologie (MEMS, circuits, assemblages)', 'Entreprises microélectronique', '45, Bd de l’Aéroport, Bromont QC J2L 1S8<br>450-534-8000<br[email protected]', 'Soutien fort de l’État (Canada, Québec); incubateur dans Technum Bromont', '[]', NULL, NULL, NULL, '2025-11-16 04:12:42.977756+00', '2025-11-16 20:43:59.662355+00', NULL, '["Support technologique / numérique"]'),
	('bdc-women-in-business-programs-for-women', 'Femme entrepreneure', 'Mentorat / coaching', 'Banque publique (BDC)', 'Canada (national)', 'Canada', 'Canada', 'https://www.bdc.ca/fr/je-suis/femme-entrepreneure', 'Multi', 'Contact via BDC', 'Conseil, programmes dédiés aux femmes entrepreneures', 'Femmes entrepreneurs', 'See site', 'Ressources et diagnostics', '[]', NULL, NULL, NULL, '2025-11-16 04:12:42.745581+00', '2025-11-16 04:12:42.745581+00', NULL, '["Mentorat / coaching"]'),
	('aqc-capital', 'AQC Capital', 'Incubation & accélération', 'Fonds d''investissement', NULL, 'Montréal', 'Montréal', 'https://www.aqccapital.com', NULL, 'Investissements pour membres du Réseau Anges Québec', 'Financement', 'Entreprises technologiques', 'Non spécifié', '60 investissements, 4 sorties', '[]', 'Premium domains add authority to your site. Transparent pricing. 1 year WHOIS privacy included. 30-day money back guarantee.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/aqc-capital.png', '{"tiktok": null, "twitter": null, "youtube": null, "facebook": null, "linkedin": null, "instagram": null}', '2025-11-16 04:12:42.603935+00', '2025-11-16 04:12:42.603935+00', NULL, '["Incubation & accélération"]'),
	('futurpreneur-canada', 'Futurpreneur Canada', 'Mentorat / coaching', 'OBNL / National', 'Canada (national)', 'Canada', 'Canada', 'https://futurpreneur.ca/en/', 'Multi‑sectoriel', 'Candidature en ligne; 18-39 ans; plan d''affaires', 'Mentorat 1:1, ressources business, prêts de démarrage', 'Jeunes entrepreneurs (18-39)', 'info@futurpreneur.ca', 'Programmes pour Autochtones & entrepreneurs noirs; bourses', '[]', 'Futurpreneur soutient de jeunes entrepreneur.e.s de 18 à 39 ans partout au Canada, en leur offrant notamment un prêt de démarrage et du mentorat.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/futurpreneur-canada.png', '{"tiktok": null, "twitter": "https://twitter.com/Futurpreneur", "youtube": "https://www.youtube.com/user/CYBF", "facebook": "https://www.facebook.com/Futurpreneur", "linkedin": "https://www.linkedin.com/company/futurpreneur-canada", "instagram": "https://www.instagram.com/futurpreneur"}', '2025-11-16 04:12:44.668843+00', '2025-11-16 04:12:44.668843+00', NULL, '["Mentorat / coaching", "Réseautage & communauté"]'),
	('black-opportunity-fund-black-entrepreneur-program', 'Black Opportunity Fund – Black Entrepreneur Program', 'Mentorat / coaching', 'Fonds / OBNL', 'Canada (national)', 'Canada', 'Canada', 'https://blackopportunityfund.ca/funding-programs/black-entrepreneur-program/', 'Multi', 'Candidature en ligne', 'Littératie financière, mentorat, accompagnement', 'Entrepreneurs noirs', 'Voir site', 'Appuis pour certifications', '[]', 'Established in 2020, The Black Opportunity Fund is a dynamic partnership between businesses, philanthropists, foundations, and the black community to combat the impact of anti-black racism in Canada.', NULL, '{"tiktok": null, "twitter": "https://twitter.com/BlkOpportunity", "youtube": null, "facebook": "https://www.facebook.com/BlackOpportunityFund/", "linkedin": "https://www.linkedin.com/company/68219088", "instagram": "https://instagram.com/BlkOpportunity"}', '2025-11-16 04:12:42.798911+00', '2025-11-16 04:12:42.798911+00', NULL, '["Mentorat / coaching"]'),
	('canada-digital-adoption-program-cdap', 'Canada Digital Adoption Program (CDAP)', 'Mentorat / coaching', 'Fédéral', 'Canada (national)', 'Canada', 'Canada', 'https://cdaprogram.ca/', 'Multi‑sectoriel', 'Inscription en ligne (selon cycles)', 'Diagnostic numérique, plan, subventions', 'PME', 'Voir site', 'Vise adoption e‑commerce et outils numériques', '[]', 'Help digitalize your business', NULL, '{"tiktok": null, "twitter": null, "youtube": null, "facebook": null, "linkedin": null, "instagram": null}', '2025-11-16 04:12:43.106325+00', '2025-11-16 04:12:43.106325+00', NULL, '["Mentorat / coaching"]'),
	('canexport-smes', 'CanExport SMEs', 'Support au marketing / commercialisation / accès au marché', 'Fédéral (GOC)', 'Canada (national)', 'Canada', 'Canada', 'https://www.tradecommissioner.gc.ca/en/our-solutions/funding-financing-international-business/canexport-smes.html', 'Multi', 'Appels périodiques', 'Financement export, études de marché, missions', 'PME souhaitant exporter', 'tradecommissioner.gc.ca', 'Intakes périodiques', '[]', NULL, NULL, '{"tiktok": null, "twitter": "https://x.com/TCS_SDC", "youtube": "https://www.youtube.com/channel/UC8HnUxC1vYRuPsJkZD-1qGw", "facebook": null, "linkedin": "https://www.linkedin.com/company/tcssdc", "instagram": null}', '2025-11-16 04:12:43.164047+00', '2025-11-16 04:12:43.164047+00', NULL, '["Support au marketing / commercialisation / accès au marché"]'),
	('copl-inrs-alls', 'COPL – INRS (ALLS)', 'Accès aux infrastructures ou ressources physiques', 'Public (INRS/ULaval)', NULL, NULL, 'Québec (INRS Varennes)', 'https://coplweb.ca', 'Optique, photonique et laser', 'Appel à propositions pour temps de faisceau', 'Accès au ALLS (laser femtoseconde 750TW) et autres laboratoires photoniques[15]', 'Chercheurs académiques et industriels', 'Pavillon d’Optique-Photonique, ULaval, Québec QC<br>418-656-2454<br[email protected]', 'Centre COPL (ULaval) gère accès aux installations lasers (ALLS) pour R&D', '[]', NULL, NULL, NULL, '2025-11-16 04:12:43.60365+00', '2025-11-16 20:43:59.662355+00', NULL, '["Accès aux infrastructures ou ressources physiques"]'),
	('centre-quebecois-d-innovation-en-biotechnologie-cqib', 'Centre québécois d’innovation en biotechnologie (CQIB)', 'Soutien à l''innovation et recherche/développement (R&D)', 'Public (Ville de Laval / INRS)', NULL, NULL, 'Laval (Québec)', 'https://citebiotech.com', 'Biotechnologies et santé', 'Sélection sur dossier (accès en incubé)', 'Location de laboratoires L2 sécurisées, parc d’équipements scientifiques, encadrement en affaires[10]', 'Startups et PME biotech', '1333, Bd Chomedey, Laval QC<br>450-978-5959 poste 5066<br[email protected]', 'Initiatives pré-incubation et « soft landing » pour entreprises biotech', '[]', NULL, NULL, NULL, '2025-11-16 04:12:43.536532+00', '2025-11-16 20:43:59.662355+00', NULL, '["Soutien à l''innovation et recherche/développement (R&D)"]'),
	('execution-labs', 'Execution Labs', 'Incubation & accélération', 'Privé', 'Montréal', 'Montréal', 'Montréal', 'https://www.executionlabs.com', 'Jeux vidéo', 'Sélection par portfolio', 'Financement, mentorat, réseau industrie gaming', 'Studios de jeux', 'info@executionlabs.com', 'Fondé en 2012', '[]', 'Execution Labs', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/execution-labs.png', '{"tiktok": null, "twitter": null, "youtube": null, "facebook": null, "linkedin": null, "instagram": null}', '2025-11-16 04:12:44.309425+00', '2025-11-16 20:43:58.755147+00', NULL, '["Incubation & accélération"]'),
	('bdc-advisory-services', 'BDC – Advisory Services', 'Mentorat / coaching', 'Banque publique (BDC)', 'Canada (Toronto)', 'Canada', 'Canada', 'https://www.bdc.ca/en/consulting', 'Multi‑sectoriel', 'Contact via site; service payant/subventionné', 'Coaching stratégique, marketing, finances, digital', 'PME et startups', 'See website', 'Possibilité de diagnostic digital; offres pour PME', '[]', 'Découvrez comment nos services de consultation peuvent vous aider à développer vos connaissances et votre savoir-faire pour bâtir une entreprise prospère.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/bdc-advisory-services.jpg', '{"tiktok": null, "twitter": "http://twitter.com/bdc_ca", "youtube": "http://www.youtube.com/BDCBanx", "facebook": "http://www.facebook.com/bdc.ca", "linkedin": "http://www.linkedin.com/companies/bdc?trk=fc_badge", "instagram": "https://www.instagram.com/bdc_ca"}', '2025-11-16 04:12:42.669245+00', '2025-11-16 04:12:42.669245+00', NULL, '["Mentorat / coaching"]'),
	('ag-bio-centre', 'AG-Bio Centre', 'Incubation & accélération', 'OBNL', 'Lévis', 'Lévis', 'Québec', 'https://www.linkedin.com/company/ag-bio-centre/', 'Agroalimentaire, biotechnologie', 'Sélection par projet', 'Laboratoires, mentorat, financement', 'Entreprises agroalimentaires', 'info@agbiocentre.com', 'Expertise en bio-industrie', '[]', NULL, NULL, NULL, '2025-11-16 04:12:42.34658+00', '2025-11-16 04:12:42.34658+00', NULL, '["Incubation & accélération"]'),
	('bonjourstartup-programmes-ressources', 'BonjourStartup (programmes & ressources)', 'Réseautage & communauté', 'Communauté / média', 'Montréal', 'Montréal', 'Montréal', 'https://bonjourstartup.com/', 'Multi', 'Accès libre / abonnements', 'Guides, formations, événements', 'Entrepreneurs francophones', 'See site', 'Ressources en français pour startups', '[]', NULL, NULL, NULL, '2025-11-16 04:12:42.860288+00', '2025-11-16 04:12:42.860288+00', NULL, '["Réseautage & communauté"]'),
	('brain-canada', 'Brain Canada', 'Incubation & accélération', 'Organisation nationale', NULL, 'Montréal', 'Montréal', 'https://braincanada.ca', NULL, 'Soutien à la recherche en neurosciences', 'Financement, réseautage', 'Chercheurs et startups en neurosciences', 'Non spécifié', '4 investissements, 1 sortie', '[]', 'Construire un avenir où les chercheurs en début de carrière pourront explorer les mystères de la santé du cerveau tels que la SLA et l''épilepsie.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/brain-canada.png', '{"tiktok": null, "twitter": "https://twitter.com/intent/follow?source=followbutton&variant=1.0&screen_name=BrainCanada", "youtube": null, "facebook": "https://www.facebook.com/brain.canada/", "linkedin": "http://www.linkedin.com/company/brain-canada", "instagram": "https://www.instagram.com/braincanada/"}', '2025-11-16 04:12:42.920065+00', '2025-11-16 04:12:42.920065+00', NULL, '["Incubation & accélération"]'),
	('hacking-health-accelerator', 'Hacking Health Accelerator', 'Incubation & accélération', 'Programme de croissance', NULL, 'Montréal', 'Montréal', 'https://hackinghealth.ca', NULL, 'Programme pour entreprises en santé numérique', 'Accélération, mentorat', 'Startups en santé numérique', 'Non spécifié', '9 investissements, 1 sortie', '[]', NULL, NULL, NULL, '2025-11-16 04:12:44.853566+00', '2025-11-16 04:12:44.853566+00', NULL, '["Incubation & accélération"]'),
	('les-affutes-makerspace-montreal', 'Les Affûtés (Makerspace Montréal)', 'Accès aux infrastructures ou ressources physiques', 'Entreprise (B Corp, coop.)', NULL, NULL, 'Montréal (Mile-Ex, Village)', 'https://www.les-affutes.ca', 'Bricolage, artisanat, design', 'Achat d’heures d’atelier', 'Location d’atelier (bois, couture, métal, vélo, etc.), coaching sur projet, cours et activités de formation[3]', 'Grand public, makers, créatifs', 'Mile-Ex : 6540 Rue Waverly, Montréal<br>Village : 1385 Rue Ontario E, Montréal<br>(514) 750-7252', '2 sites; adhésion horaire (ex. forfaits 10h, 30h…)', '[]', NULL, NULL, NULL, '2025-11-16 04:12:45.412106+00', '2025-11-16 20:43:59.662355+00', NULL, '["Accès aux infrastructures ou ressources physiques"]'),
	('creative-destruction-lab-cdl-montreal', 'Creative Destruction Lab (CDL) - Montréal', 'Mentorat / coaching', 'Programme universitaire', 'Montréal (occasionnel)', 'Montréal', 'Montréal', 'https://creativedestructionlab.com/locations/montreal/', 'AI, deeptech', 'Candidature sélective', 'Mentorat par investisseurs & entrepreneurs, sessions périodiques', 'Startups deeptech early-stage', 'See site', 'Très axé IA / deeptech', '[]', 'Le CDL-Montréal opère à partir de HEC Montréal. Située dans une ville où l''écosystème de l''intelligence artificielle est florissant, HEC Montréal est une école de commerce de premier plan et est à l''avant-garde de la recherche en science des données depuis 40 ans. CDL-Montréal gère un programme axé sur l''intelligence artificielle et la science des données afin de tirer parti de l''expertise montréalaise dans le secteur. [...]', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/creative-destruction-lab-cdl-montreal.png', '{"tiktok": null, "twitter": "https://twitter.com/creativedlab", "youtube": null, "facebook": "https://www.facebook.com/creativedestructionlab/", "linkedin": "https://www.linkedin.com/company/11209954/", "instagram": "https://www.instagram.com/creativedestructionlab/?hl=en"}', '2025-11-16 04:12:43.709384+00', '2025-11-16 04:12:43.709384+00', NULL, '["Mentorat / coaching"]'),
	('centre-d-innovation-sociale-institut-various', 'Centre d''innovation sociale - Institut (various)', 'Formation & développement de compétences', 'Organisme', 'Québec', 'Canada', 'Canada', 'https://socialinnovation.ca/', 'Social / multi', 'Contact via site', 'Formations, accompagnement projets sociaux', 'Entrepreneurs sociaux', 'See site', 'Réseau national', '[]', NULL, NULL, NULL, '2025-11-16 04:12:43.451431+00', '2025-11-16 04:12:43.451431+00', NULL, '["Formation & développement de compétences"]'),
	('centech', 'CENTECH', 'Incubation & accélération', 'OBNL', 'Montréal', 'Montréal', 'Montréal', 'https://centech.co', 'Technologie, deeptech', 'Programme Accélération ou Propulsion', 'Mentorat, financement, espace de travail', 'Startups technologiques', 'info@centech.co', 'Partenaire avec ÉTS', '[]', 'Centech, incubateur à Montréal, accompagne les startups technologiques avec programmes de soutien, mentorat et ressources pour innover. Contactez-nous.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/centech.png', '{"tiktok": null, "twitter": null, "youtube": "https://www.youtube.com/channel/UCBE0aabDceUdOvd_NtX-jig", "facebook": "https://www.facebook.com/CentechMtl/", "linkedin": "https://www.linkedin.com/company/centech-mtl?trk=extra_biz_viewers_viewed", "instagram": "https://www.instagram.com/centechmtl/"}', '2025-11-16 04:12:43.286698+00', '2025-11-16 04:12:43.286698+00', NULL, '["Incubation & accélération"]'),
	('centre-de-developpement-bioalimentaire-du-quebec-cdbq', 'Centre de développement bioalimentaire du Québec (CDBQ)', 'Incubation & accélération', 'OBNL', 'La Pocatière', 'La Pocatière', 'La Pocatière', 'https://cdbq.net', 'Agroalimentaire', 'Sélection par projet', 'Laboratoires, expertise technique', 'Entreprises agroalimentaires', 'info@cdbq.net', 'Expertise en transformation alimentaire', '[]', NULL, NULL, '{"tiktok": null, "twitter": null, "youtube": null, "facebook": "https://www.facebook.com/centrededeveloppementbioalimentaireduquebec/", "linkedin": "https://ca.linkedin.com/company/centre-de-developpement-bioalimentaire-du-quebec/", "instagram": null}', '2025-11-16 04:12:43.342491+00', '2025-11-16 04:12:43.342491+00', NULL, '["Incubation & accélération"]'),
	('apollo13', 'Apollo13', 'Incubation & accélération', 'Privé', 'Montréal', 'Montréal', 'Montréal', 'https://apollo13.co', 'Technologie', 'Sélection par projet', 'Mentorat, financement, réseautage', 'Startups tech', 'info@apollo13.co', 'Focus sur croissance rapide', '[]', 'Un studio de développement web spécialisé en création de MVP propulsé par les technologies no-code & low-code.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/apollo13.png', '{"tiktok": null, "twitter": "https://twitter.com/a13startups", "youtube": null, "facebook": "https://www.facebook.com/apollo13startups/", "linkedin": "https://www.linkedin.com/company/apollo13/", "instagram": "https://www.instagram.com/a13startups/"}', '2025-11-16 04:12:42.536443+00', '2025-11-16 04:12:42.536443+00', '2025-11-16 20:51:48.839+00', '["Incubation & accélération"]'),
	('quebec-tech-pour-le-succes-des-startups-tech', 'Québec Tech : pour le succès des startups tech', '', NULL, NULL, NULL, NULL, 'https://www.quebectech.com/', NULL, NULL, NULL, NULL, NULL, NULL, '[]', 'Québec Tech : une initiative pour faire des startups technologiques du Québec un moteur de croissance durable, au Québec et à l''international. Services d''accompagnement pour l''exportation et le passage au stade de scaleup.', NULL, NULL, '2025-11-16 04:39:36.842242+00', '2025-11-16 04:39:36.842242+00', NULL, '[]'),
	('echofab-fab-lab-du-qi-de-montreal', 'échofab (Fab Lab du QI de Montréal)', 'Support technologique / numérique', 'OBNL (communautaire)', NULL, NULL, 'Montréal (District Central)', 'https://www.echofab.quebec', 'Fabrication numérique, innovation sociale', 'Adhésion/formation en fablab', 'Accès à ateliers de découpe laser, impression 3D, CNC, ateliers d’initiation et de prototypage, formations[2]', 'Entrepreneurs, étudiants, artistes', '55 rue de Louvain Ouest, Montréal<br>514-948-6644<br[email protected]', 'Organisme de Communautique (centre de ressources numériques)', '[]', NULL, NULL, NULL, '2025-11-16 04:12:43.942136+00', '2025-11-16 20:43:59.662355+00', NULL, '["Support technologique / numérique"]'),
	('dmz-toronto', 'DMZ Toronto', 'Incubation & accélération', 'Accélérateur universitaire', 'Toronto', 'Toronto', 'Canada', 'https://dmz.ryerson.ca', 'Technologie', 'Programme intensif de 13 semaines', 'Mentorat, financement, réseautage, espace de travail', 'Startups technologiques', 'info@dmz.ryerson.ca', 'Plus de 300 startups accompagnées', '[]', 'DMZ at Toronto Metropolitan University helps tech founders build, launch, and scale. We’ve supported 2,450+ startups raising $2.94B+ across 15+ countries.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/dmz-toronto.png', '{"tiktok": "https://www.tiktok.com/@dmzhq", "twitter": "https://x.com/dmzhq", "youtube": "https://www.youtube.com/@dmzhq_", "facebook": "https://www.facebook.com/DMZHQ/", "linkedin": "https://www.linkedin.com/company/dmzhq/", "instagram": "https://www.instagram.com/dmzhq"}', '2025-11-16 04:12:43.824695+00', '2025-11-16 04:12:43.824695+00', NULL, '["Incubation & accélération"]'),
	('femmessor-quebec', 'Femmessor (Québec)', 'Mentorat / coaching', NULL, 'Québec (provincial)', 'Québec (Hors Montréal)', 'Québec (Hors Montréal)', 'https://femmessor.com/', 'Multi', 'Candidature en ligne, programmes régionaux', 'Mentorat, financement pour femmes entrepreneures, ateliers', 'Femmes entrepreneures au Québec', 'See site', 'Réseau régional, services divers', '[]', 'Prêt d’entreprise et accompagnement. Services destinés aux entreprises qui s’engagent dans une démarche de développement durable.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/femmessor-quebec.jpg', '{"tiktok": null, "twitter": null, "youtube": "https://www.youtube.com/channel/UCtul9JAsLW-vB_KrlGSxHOw", "facebook": "https://www.facebook.com/EvolQC", "linkedin": "https://www.linkedin.com/company/evolfinancement/", "instagram": null}', '2025-11-16 04:12:44.376845+00', '2025-11-16 04:12:44.376845+00', NULL, '["Mentorat / coaching"]'),
	('dobson-centre-for-entrepreneurship-mcgill', 'Dobson Centre for Entrepreneurship (McGill)', 'Incubation & accélération', 'Université (McGill)', 'Montréal', 'Montréal', 'Montréal', 'https://www.mcgill.ca/dobson/', 'Multi', 'Programmes campus; application selon programme', 'Coaching, programmes d''incubation, mentorat, événements', 'Étudiants, alumni, startups', 'dobson.mgmt@mcgill.ca', 'Programmes: Ideation, Validation, Acceleration', '[]', NULL, NULL, '{"tiktok": null, "twitter": "https://twitter.com/mcgillu", "youtube": "https://www.youtube.com/mcgilluniversity", "facebook": "https://www.facebook.com/McGillUniversity", "linkedin": "https://www.linkedin.com/school/mcgill-university/", "instagram": "https://www.instagram.com/mcgillu/"}', '2025-11-16 04:12:43.881345+00', '2025-11-16 04:12:43.881345+00', NULL, '["Incubation & accélération"]'),
	('ecofuel', 'Ecofuel', 'Incubation & accélération', 'Fonds d''investissement spécialisé', NULL, 'Montréal', 'Montréal', 'https://www.ecofuel.ca', NULL, 'Investissements en technologies propres', 'Financement, accompagnement', 'Startups en cleantech', 'Non spécifié', '23 investissements', '[]', NULL, NULL, NULL, '2025-11-16 04:12:44.010226+00', '2025-11-16 04:12:44.010226+00', NULL, '["Incubation & accélération"]'),
	('espace-entrepreneuriat-collectif', 'Espace entrepreneuriat collectif', 'Incubation & accélération', 'OBNL', 'Québec', 'Québec', 'Québec', 'https://espacecollectif.ca', 'Économie sociale', 'Programme d''accompagnement', 'Mentorat, ateliers, réseautage', 'Entrepreneurs collectifs', 'info@espacecollectif.ca', 'Soutien à projets collectifs', '[]', NULL, NULL, NULL, '2025-11-16 04:12:44.187196+00', '2025-11-16 04:12:44.187196+00', NULL, '["Incubation & accélération"]'),
	('fondation-de-l-entrepreneurship-quebec', 'Fondation de l''entrepreneurship - Québec', 'Réseautage & communauté', 'Fondation', 'Québec (provincial)', 'Québec (Hors Montréal)', 'Québec (Hors Montréal)', 'https://www.entrepreneurshipfoundation.ca/', 'Multi', 'Programmes & ressources', 'Formations, programmes scolaires, mentorship', 'Jeunes entrepreneurs & leaders', 'See site', 'Orientation éducative', '[]', NULL, NULL, NULL, '2025-11-16 04:12:44.435515+00', '2025-11-16 04:12:44.435515+00', NULL, '["Réseautage & communauté"]'),
	('ecole-des-entrepreneurs-du-quebec', 'École des Entrepreneurs du Québec', 'Formation & développement de compétences', 'Organisme provincial', 'Québec (régional)', 'Québec (Hors Montréal)', 'Québec (Hors Montréal)', 'https://eequebec.com/', 'Multi', 'Inscription en ligne', 'Formations, parcours, mentorat, programmes pour femmes', 'Entrepreneurs Québec', 'See site', 'Large offre de formation province-wide', '[]', 'Projet A vous aide à créer votre plan d''affaires et Business Model Canvas (BMC).', NULL, NULL, '2025-11-16 04:12:44.079387+00', '2025-11-16 04:12:44.079387+00', NULL, '["Formation & développement de compétences"]'),
	('esplanade-quebec', 'Esplanade Québec', 'Support thématique ou pour groupes sous-représentés', 'OBNL', 'Montréal', 'Montréal', 'Montréal', 'https://esplanade.quebec', 'Innovation sociale', 'Programme Collision ou Transformation', 'Mentorat, ateliers, financement', 'Entrepreneurs sociaux', 'info@esplanade.quebec', 'Impact social et environnemental', '[]', 'L''Esplanade est le premier accélérateur des entrepreneur.e.s d''impact social et environnemental du Québec.', NULL, '{"tiktok": null, "twitter": "https://twitter.com/esplanadeqc", "youtube": "https://www.youtube.com/@esplanadequebec1521", "facebook": "https://www.facebook.com/esplanade.quebec", "linkedin": "https://www.linkedin.com/company/esplanade-montr%C3%A9al/", "instagram": "https://www.instagram.com/esplanade_qc/"}', '2025-11-16 04:12:44.249157+00', '2025-11-16 04:12:44.249157+00', NULL, '["Support thématique ou pour groupes sous-représentés"]'),
	('hub-ia-innovation-en-ia', 'Hub-IA (Innovation en IA)', 'Accès aux infrastructures ou ressources physiques', 'Privé', NULL, NULL, 'Montréal (centre-ville)', 'https://hub-ia.ca', 'Intelligence artificielle, tech', 'Location flexible (poste/bureau, 24/7)', 'Bureaux partagés ou privés, Wi-Fi, salles de réunion, accès GPU/serveurs pour IA[6], événements et conférences IA', 'Startups & chercheurs en IA', '(voir site web pour contact)', 'Ciblé IA – cartes GPU et experts en data science sur place[6]', '[]', NULL, NULL, NULL, '2025-11-16 04:12:44.984813+00', '2025-11-16 20:43:59.662355+00', NULL, '["Accès aux infrastructures ou ressources physiques"]'),
	('innovation-canada-portail', 'Innovation Canada (Portail)', 'Réseautage & communauté', 'Fédéral (ISDE)', 'Canada (national)', 'Canada', 'Canada', 'https://ised-isde.canada.ca/site/innovation-canada/en/innovation-canada', 'Multi', 'Accès libre', 'Recherche de programmes, diagnostics, guides', 'Entrepreneurs, innovateurs', 'site web', 'Outil central pour retrouver services fédéraux', '[]', 'Du financement à la prestation de conseils spécialisés, en passant par l''établissement de nouvelles collaborations, nos services et nos programmes phares visent à aider les entreprises à innover, à créer des emplois et à stimuler l''économie du Canada.', NULL, '{"tiktok": null, "twitter": null, "youtube": null, "facebook": null, "linkedin": null, "instagram": null}', '2025-11-16 04:12:45.04293+00', '2025-11-16 04:12:45.04293+00', NULL, '["Réseautage & communauté"]'),
	('garage-co', 'Garage&co', 'Incubation & accélération', 'Accélérateur hardtech', NULL, 'Montréal', 'Montréal', 'https://garageincubation.com', NULL, 'Programme d''accompagnement pour projets technologiques', 'Mentorat, expertise, réseau', 'Startups en hardtech', 'info@garageincubation.com', 'Focus sur innovation durable', '[]', 'Nous faisons grandir les startups en hardtech à travers l''écosystème local.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/garage-co.jpg', '{"tiktok": null, "twitter": null, "youtube": null, "facebook": null, "linkedin": "https://www.linkedin.com/company/garageincubateur/", "instagram": "https://www.instagram.com/garageincubation/"}', '2025-11-16 04:12:44.728775+00', '2025-11-16 04:12:44.728775+00', NULL, '["Incubation & accélération"]'),
	('founderfuel', 'FounderFuel', 'Incubation & accélération', 'Privé', 'Montréal', 'Montréal', 'Montréal', 'https://www.founderfuel.com', NULL, 'Programme intensif de 4 mois, 9% d''équité, financement de 50 000$', 'Mentorat, espace, soutien, connexions', 'Fondateurs de startups technologiques', 'Non spécifié', '95 investissements, 13 sorties', '[]', NULL, NULL, '{"tiktok": null, "twitter": "https://twitter.com/founderfuel", "youtube": null, "facebook": "https://www.facebook.com/FounderFuel/", "linkedin": "https://www.linkedin.com/company/founderfuel/", "instagram": "https://www.instagram.com/founderfuel/"}', '2025-11-16 04:12:44.610894+00', '2025-11-16 04:12:44.610894+00', NULL, '["Incubation & accélération"]'),
	('hec-montreal-la-base-entrepreneuriale', 'HEC Montréal - La base entrepreneuriale', 'Incubation & accélération', 'Université (HEC Montréal)', 'Montréal (McGill U)', 'Montréal', 'Montréal', 'https://labase.hec.ca/', 'Tech / Impact / Multi', 'Candidature selon programme', 'Coaching, accélération, mentorat, réseaux', 'Étudiants, alumni, startups', 'Voir site', 'Hub d''innovation universitaire', '[]', 'Bâtis ton succès! Recrutement en cours! Déposez votre dossier Découvrir nos parcours Hub d’innovation universitaire propulsant la relève en entrepreneuriat technologique et d’impact À La base entrepreneuriale HEC Montréal, la mission est claire : inspirer et propulser l’entrepreneuriat à impact économique et sociétal et l’entrepreneuriat technologique, tant au Québec qu’à l’international. La base est convaincue […]', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/hec-montreal-la-base-entrepreneuriale.jpg', '{"tiktok": null, "twitter": null, "youtube": null, "facebook": null, "linkedin": null, "instagram": null}', '2025-11-16 04:12:44.911654+00', '2025-11-16 04:12:44.911654+00', NULL, '["Incubation & accélération"]'),
	('groupe-3737', 'Groupe 3737', 'Incubation & accélération', 'Accélérateur communautaire', NULL, 'Montréal', 'Montréal', 'https://groupe3737.com', NULL, 'Programmes pour entrepreneurs issus de la diversité', 'Formation, mentorat, financement', 'Entrepreneurs issus de la diversité ethnoculturelle', 'contact@groupe3737.com', 'Impact économique et social', '[]', NULL, NULL, '{"tiktok": null, "twitter": "https://twitter.com/Groupe3737?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor", "youtube": "https://www.youtube.com/channel/UC2QH8Ea-rq1HF6Jvp_SZnJw", "facebook": "https://www.facebook.com/profile.php?id=61565310930498", "linkedin": "https://www.linkedin.com/company/groupe-3737/", "instagram": "https://www.instagram.com/groupe3737/"}', '2025-11-16 04:12:44.78602+00', '2025-11-16 04:12:44.78602+00', NULL, '["Incubation & accélération"]'),
	('lespacemaker', 'LESPACEMAKER', 'Support technologique / numérique', 'OBNL (coopératif)', NULL, NULL, 'Montréal', 'https://lespacemaker.com (EN/FR)', 'Ateliers bois, métal, textile, électronique', 'Adhésion mensuelle (abonnement)', 'Accès aux ateliers (bois, métal, forge, sérigraphie, vélo, 3D, laser, électronique, céramique, cuir, couture, recyclage)[4]', 'Public large (bricoleurs, designers)', '(Pas de contact direct cité)', 'Forte composante socio-écologique; événements ouverts (réparathons, visites)', '[]', NULL, NULL, NULL, '2025-11-16 04:12:45.466774+00', '2025-11-16 20:43:59.662355+00', NULL, '["Support technologique / numérique"]'),
	('millenium-quebecor-universite-de-montreal', 'Millénium Québecor (Université de Montréal)', 'Mentorat / coaching', 'Université (UdeM)', 'Montréal (HEC)', 'Montréal', 'Montréal', 'https://millenium.umontreal.ca/', 'Multi', 'Inscription aux programmes universitaires', 'Coaching, sensibilisation, soutien à la création', 'Étudiants & chercheurs', 'Voir site', 'Programme gratuit pour étudiants', '[]', 'Découvre ta force cachée! Millénium Québecor soutient les créateurs d’entreprises afin que leurs projets d’affaires puissent devenir réalité.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/millenium-quebecor-universite-de-montreal.png', '{"tiktok": null, "twitter": null, "youtube": "https://www.youtube.com/@Milleniumquebecor", "facebook": "https://www.facebook.com/Milleniumquebecor", "linkedin": "https://www.linkedin.com/company/milleniumquebecor/?viewAsMember=true", "instagram": "https://www.instagram.com/milleniumquebecor"}', '2025-11-16 04:12:45.579961+00', '2025-11-16 04:12:45.579961+00', NULL, '["Mentorat / coaching"]'),
	('mt-lab', 'MT Lab', 'Incubation & accélération', 'OBNL', 'Montréal', 'Montréal', 'Montréal', 'https://mtlab.ca', 'Tourisme, culture, divertissement', 'Candidature en ligne', 'Mentorat, tests en marché, réseautage', 'Startups tourisme et culture', 'info@mtlab.ca', 'Premier incubateur en tourisme au Québec', '[]', 'Premier incubateur en innovation en Amérique du Nord. Tourisme, culture et divertissement. Partenaire du Welcome City Lab à Paris', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/mt-lab.jpg', '{"tiktok": null, "twitter": null, "youtube": null, "facebook": "https://www.facebook.com/MTlabTourisme", "linkedin": "https://linkedin.com/company/mt-lab", "instagram": "https://www.instagram.com/mtlabtourisme/"}', '2025-11-16 04:12:45.634059+00', '2025-11-16 04:12:45.634059+00', NULL, '["Incubation & accélération"]'),
	('le-camp', 'Le Camp', 'Incubation & accélération', 'OBNL', 'Québec', 'Québec', 'Québec', 'https://lecampquebec.com', 'Technologie, SaaS', 'Candidature en ligne', 'Coaching, mentorat, réseautage, internationalisation', 'Startups technologiques', 'info@lecampquebec.com', 'Soutenu par Québec International', '[]', 'Nous soutenons les entreprises innovantes à chaque étape de leur croissance, du prédémarrage à l''expansion internationale. Grâce à nos programmes sur mesure, nos coachs experts et notre réseau de partenaires, nous propulsons des entreprises technologiques vers un succès durable et de classe mondiale.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/le-camp.png', '{"tiktok": null, "twitter": null, "youtube": null, "facebook": null, "linkedin": null, "instagram": null}', '2025-11-16 04:12:45.305488+00', '2025-11-16 04:12:45.305488+00', NULL, '["Incubation & accélération"]'),
	('la-chambre-de-commerce-du-montreal-metropolitain-ccmm', 'La Chambre de commerce du Montréal métropolitain (CCMM)', 'Réseautage & communauté', 'Chambre de commerce', 'Montréal / Québec', 'Montréal', 'Montréal', 'https://www.ccmm.ca/', 'Multi', 'Adhésion / inscription', 'Formations, ateliers, missions commerciales', 'Entreprises locales', 'Voir site', 'Accès réseautage', '[]', 'Bienvenue sur le site de la chambre du commerce de Montréal. Découvrez les événements, conférences et formations organisés par la CCMM.', NULL, '{"tiktok": null, "twitter": "https://twitter.com/chambremontreal", "youtube": "https://www.youtube.com/channel/UCcKt3yteCzkJ1673Z1Oh8ug?&ab_channel=ChambredecommerceduMontr%C3%A9alm%C3%A9tropolitain", "facebook": "https://www.facebook.com/chambremontreal", "linkedin": "https://www.linkedin.com/company/chambre-de-commerce-du-montreal-m-tropolitain/mycompany/?viewAsMember=true", "instagram": null}', '2025-11-16 04:12:45.146774+00', '2025-11-16 04:12:45.146774+00', NULL, '["Réseautage & communauté"]'),
	('la-shop', 'La shop', 'Incubation & accélération', 'OBNL', 'Québec', 'Québec', 'Québec', 'https://lashop.ca', 'Entrepreneuriat', 'Candidature en ligne', 'Mentorat, espace de travail', 'Entrepreneurs', 'info@lashop.ca', 'Communauté entrepreneuriale', '[]', NULL, NULL, NULL, '2025-11-16 04:12:45.249822+00', '2025-11-16 04:12:45.249822+00', NULL, '["Incubation & accélération"]'),
	('le-germoir', 'Le Germoir', 'Incubation & accélération', 'OBNL', 'Québec', 'Québec', 'Québec', 'https://legermoir.ca', 'Entrepreneuriat collectif', 'Programme d''accompagnement', 'Mentorat, ateliers, réseautage', 'Entrepreneurs collectifs', 'info@legermoir.ca', 'Soutien à l''économie sociale', '[]', NULL, NULL, NULL, '2025-11-16 04:12:45.361778+00', '2025-11-16 04:12:45.361778+00', NULL, '["Incubation & accélération"]'),
	('la-piscine-montreal', 'La Piscine (Montréal)', 'Incubation & accélération', 'Incubateur privé/OBNL', 'Montréal', 'Montréal', 'Montréal', 'https://www.lapiscine.co/', 'Culture & créatif', 'Candidature en ligne', 'Coaching, espace, bourses, réseautage', 'Entrepreneurs créatifs', 'plouf@lapiscine.co', 'Programmes pour internationalisation', '[]', 'La Piscine propulse les entrepreneurs culturels et créatifs via des programmes, des espaces de travail, des événements et des services.', NULL, '{"tiktok": null, "twitter": null, "youtube": "https://www.youtube.com/channel/UC24qrD8O4eMdDhZ6KPwAeIw", "facebook": "https://www.facebook.com/LaPiscineMTL/", "linkedin": "https://www.linkedin.com/company/lapiscinemtl/", "instagram": "https://www.instagram.com/lapiscinemtl/"}', '2025-11-16 04:12:45.199113+00', '2025-11-16 04:12:45.199113+00', NULL, '["Incubation & accélération"]'),
	('startup-montreal-reseau', 'Startup Montréal (réseau)', 'Réseautage & communauté', 'Réseau local', 'Montréal', 'Montréal', 'Montréal', 'https://startupmontreal.com/', 'Multi', 'Inscription aux événements', 'Événements, workshops, visibilité', 'Écosystème startup MTL', 'See site', 'Calendrier d''événements locaux', '[]', 'Québec Tech : une initiative pour faire des startups technologiques du Québec un moteur de croissance durable, au Québec et à l''international. Services d''accompagnement pour l''exportation et le passage au stade de scaleup.', NULL, '{"tiktok": null, "twitter": "https://x.com/quebectech_", "youtube": "https://www.youtube.com/channel/UCWQKgg8wKsVu3fFMtAIk-5g", "facebook": "https://www.facebook.com/quebectechqc/", "linkedin": "https://linkedin.com/company/quebectech", "instagram": "https://www.instagram.com/quebec_tech"}', '2025-11-16 04:12:46.298841+00', '2025-11-16 04:12:46.298841+00', NULL, '["Réseautage & communauté"]'),
	('pme-mtl-services-d-accompagnement', 'PME MTL - Services d''accompagnement', 'Conseils techniques ou sectoriels', 'Organisme municipal / OBNL', 'Montréal (HEC Montréal)', 'Montréal', 'Montréal', 'https://pmemtl.com/', 'Multi', 'Contact via site', 'Coaching, formation, réseautage, financement local', 'Entrepreneurs de l''île de Montréal', 'Voir site', 'Programmes pour femmes et quartiers', '[]', NULL, 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/pme-mtl-services-d-accompagnement.jpg', '{"tiktok": null, "twitter": null, "youtube": "https://www.youtube.com/channel/UCSBcU913V-y0h9vmOOd4dBg", "facebook": "https://www.facebook.com/PMEMTL", "linkedin": "https://www.linkedin.com/company/pme-mtl/", "instagram": "https://www.instagram.com/pmemtl/"}', '2025-11-16 04:12:45.795339+00', '2025-11-16 04:12:45.795339+00', NULL, '["Conseils techniques ou sectoriels"]'),
	('promontreal-entrepreneurs-pme', 'ProMontreal Entrepreneurs (PME)', 'Incubation & accélération', 'Fonds de capital de démarrage', NULL, 'Montréal', 'Montréal', 'https://www.promontrealentrepreneurs.org', NULL, 'Financement de démarrage', 'Soutien aux nouvelles entreprises', 'Entrepreneurs montréalais', 'Non spécifié', '40 investissements, 2 sorties', '[]', NULL, NULL, NULL, '2025-11-16 04:12:45.853207+00', '2025-11-16 04:12:45.853207+00', NULL, '["Incubation & accélération"]'),
	('republique-entrepreneurs-incubateur-social', 'République Entrepreneurs (incubateur social)', 'Incubation & accélération', 'Incubateur social / OBNL', 'Montréal (UQAM)', 'Montréal', 'Montréal', 'https://www.republiqueentrepreneurs.org/', 'Social / commerce', 'Candidature', 'Accompagnement, formation, espace', 'Entrepreneurs sociaux', 'See site', 'Peut être pertinent pour dimension sociale du projet', '[]', NULL, NULL, NULL, '2025-11-16 04:12:45.924227+00', '2025-11-16 04:12:45.924227+00', NULL, '["Incubation & accélération"]'),
	('reseau-mentorat-quebec', 'Réseau Mentorat (Québec)', 'Mentorat / coaching', 'Réseau', 'Québec (QC)', 'Québec (Hors Montréal)', 'Québec (Hors Montréal)', 'https://www.reseaumentorat.org/', 'Multi', 'Inscription en ligne; jumelage', 'Mentorat 1:1, group mentoring', 'Entrepreneurs', 'Voir site', 'Réseau provincial', '[]', NULL, NULL, '{"tiktok": null, "twitter": null, "youtube": null, "facebook": null, "linkedin": null, "instagram": null}', '2025-11-16 04:12:46.003779+00', '2025-11-16 04:12:46.003779+00', NULL, '["Mentorat / coaching"]'),
	('sodec-soutien-culture-tourisme', 'SODEC - Soutien culture/tourisme', 'Soutien global de croissance & planification stratégique', 'Agence provinciale', 'Québec (provincial)', 'Québec (Hors Montréal)', 'Québec (Hors Montréal)', 'https://sodec.gouv.qc.ca/', 'Culture & tourisme', 'Appels / demandes', 'Soutien projets culturels, conseils', 'Entreprises culturelles', 'Voir site', 'Peut aider pour côté culturel/expérience', '[]', 'SODEC : Aide financière, financement et crédits d''impôts pour les entreprises culturelles des domaines audiovisuel, livre, musique, métiers d''art, numérique', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/sodec-soutien-culture-tourisme.png', '{"tiktok": null, "twitter": null, "youtube": null, "facebook": "https://www.facebook.com/la.sodec", "linkedin": "https://www.linkedin.com/company/sodec", "instagram": "https://www.instagram.com/la.sodec"}', '2025-11-16 04:12:46.18573+00', '2025-11-16 04:12:46.18573+00', NULL, '["Soutien global de croissance & planification stratégique"]'),
	('sheeo-coralus-anciennement-sheeo', 'SheEO / Coralus (anciennement SheEO)', 'Mentorat / coaching', 'Réseau / OBNL', 'National', 'Canada', 'Canada', 'https://coralus.sheeo.world/', 'Multi (femmes entrepreneures)', 'Application en ligne pour venture & participation des activatrices', 'Microloans, mentorship, réseau, support non-dilutif', 'Women-led ventures', 'See site', 'Modèle de financement participatif par activatrices', '[]', NULL, NULL, '{"tiktok": null, "twitter": "https://www.twitter.com/coralus_world", "youtube": "https://www.youtube.com/c/Coralus_World", "facebook": "https://www.facebook.com/CoralusWorld", "linkedin": "https://www.linkedin.com/company/sheeo-world/", "instagram": "https://www.instagram.com/coralus.world"}', '2025-11-16 04:12:46.122749+00', '2025-11-16 04:12:46.122749+00', NULL, '["Mentorat / coaching"]'),
	('nrc-irap', 'NRC IRAP', 'Conseils techniques ou sectoriels', 'Fédéral (NRC)', 'Canada (national)', 'Canada', 'Canada', 'https://nrc.canada.ca/en/support-technology-innovation/about-nrc-industrial-research-assistance-program', 'Tech / Innovation', 'Demande via portails régionaux', 'Conseils en innovation, financement R&D, experts', 'PME innovantes', 'Voir site NRC IRAP', 'Axé sur R&D technologique', '[]', 'Conseil national de recherches du Canada : Accueil', NULL, '{"tiktok": null, "twitter": "https://twitter.com/cnrc_nrc", "youtube": null, "facebook": null, "linkedin": "http://www.linkedin.com/company/8417?trk=tyah", "instagram": "https://www.instagram.com/nrc_cnrc/"}', '2025-11-16 04:12:45.739335+00', '2025-11-16 04:12:45.739335+00', NULL, '["Conseils techniques ou sectoriels"]'),
	('ceim-centech', 'CEIM (Centech)', 'Incubation & accélération', 'OBNL', NULL, NULL, 'Montréal (Vieux-Mtl)', 'https://www.ceim.org', 'Technologies propres, numériques, jeu vidéo', 'Admission par appel de projets', 'Services-conseils (recherche financement, marché, export, commercialisation)[12], réseau d’investisseurs, espace de coworking', 'PME technologiques', '33, Rue Prince, Montréal (QC) H3C 2M7<br>514-866-0575', 'Fondé en 1996; fort accent sur tech & industries créatives', '[]', 'ONLINE REGISTRATION FORM Please fill out the form below to complete your registration.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/ceim-centech.png', '{"tiktok": null, "twitter": null, "youtube": "https://www.youtube.com/channel/UCz7kallFQwZZMVj1Fil7efg", "facebook": "https://www.facebook.com/CEIMincubateur/", "linkedin": "https://www.linkedin.com/company/ceim", "instagram": "https://www.instagram.com/ceim.incubateur/"}', '2025-11-16 04:12:43.21987+00', '2025-11-16 04:12:43.21987+00', NULL, '["Incubation & accélération"]'),
	('mentor-canada', 'Mentor Canada', 'Mentorat / coaching', 'OBNL / National', 'Canada', 'Canada', NULL, 'https://nextcanada.com', 'Technologie', 'Programme Next 36 / Next AI', 'Mentorat, coaching, financement', 'Entrepreneurs tech', 'info@nextcanada.com', 'Focus sur leadership et IA', '[]', NULL, 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/mentor-canada.jpg', '{"tiktok": null, "twitter": "https://twitter.com/next_canada", "youtube": null, "facebook": "https://facebook.com/nextcanadaorg", "linkedin": "https://www.linkedin.com/company/next-canada/", "instagram": "https://www.instagram.com/next_canada/"}', '2025-11-16 04:12:46.623679+00', '2025-11-16 04:12:46.623679+00', NULL, '["Mentorat / coaching"]'),
	('women-entrepreneurship-knowledge-hub-wekh', 'Women Entrepreneurship Knowledge Hub (WEKH)', 'Réseautage & communauté', 'Réseau / OBNL', 'Canada', 'Canada', 'Canada', 'https://wekh.ca/', 'Multi', 'Inscription plateforme', 'Ressources, data, programmes pour femmes', 'Femmes entrepreneures', 'Voir site', 'Ressources sectorielles', '[]', 'Women Entrepreneurship Knowledge Hub', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/women-entrepreneurship-knowledge-hub-wekh.jpg', '{"tiktok": null, "twitter": "https://twitter.com/wekh_pcfe", "youtube": "https://www.youtube.com/channel/UCrAH4PNQ3XCEd3AWFNp9ZsA?feature=emb_ch_name_ex", "facebook": "https://www.facebook.com/WEKHPCFE/", "linkedin": "https://www.linkedin.com/company/wekh-pcfe/", "instagram": "https://www.instagram.com/wekh_pcfe/"}', '2025-11-16 04:12:46.459221+00', '2025-11-16 04:12:46.459221+00', NULL, '["Réseautage & communauté"]'),
	('tourisme-montreal-programmes-ressources', 'Tourisme Montréal - Programmes & Ressources', 'Conseils techniques ou sectoriels', 'Organisme sectoriel', 'Canada (national)', 'Montréal', 'Montréal', 'https://www.tourisme-montreal.org/', 'Tourisme & hospitalité', 'Contact via site; adhésion', 'Promotion, formations, partenariat', 'Entreprises touristiques', 'Voir site', 'Pertinent pour hammam touristique', '[]', NULL, NULL, NULL, '2025-11-16 04:12:46.402792+00', '2025-11-16 04:12:46.402792+00', NULL, '["Conseils techniques ou sectoriels"]'),
	('edc-trade-accelerator-program-tap', 'EDC – Trade Accelerator Program (TAP)', 'Mentorat / coaching', 'Agence publique (EDC)', 'Canada (national)', 'Canada', 'Canada', 'https://www.edc.ca/en/campaign/trade-accelerator-program.html', 'Multi', 'Inscription en ligne', 'Workshops, mentorat export, réseau', 'PME prêtes à exporter', 'Voir site', 'Modules structurés', '[]', 'Le passage aux cours virtuels n’empêche pas EDC de poursuivre sa collaboration avec le World Trade Centre de Toronto pour vous présenter le Programme d’accélération du commerce (PAC), une plateforme d’apprentissage complète. Vous y apprendrez comment prendre de l’expansion et bénéficierez d’un mentorat direct et d’un encadrement personnalisé par des experts. Inscrivez-vous maintenant à ces cours prisés.', NULL, '{"tiktok": null, "twitter": null, "youtube": null, "facebook": null, "linkedin": null, "instagram": null}', '2025-11-16 04:12:44.131805+00', '2025-11-16 04:12:44.131805+00', NULL, '["Mentorat / coaching"]'),
	('yaroka-technologies', 'Yaroka Technologies', 'Incubation & accélération', 'Incubateur environnemental', 'Montréal', 'Montréal', 'Montréal', 'https://yaroka.ca', NULL, 'Expertise en climatologie et technologie', 'Accompagnement, expertise', 'Startups en climatologie et environnement', 'Non spécifié', 'Non spécifié', '[]', NULL, NULL, NULL, '2025-11-16 04:12:46.511636+00', '2025-11-16 04:12:46.511636+00', NULL, '["Incubation & accélération"]'),
	('zu-montreal', 'Zú Montréal', 'Incubation & accélération', 'Incubateur créatif', 'Montréal', 'Montréal', 'Montréal', 'https://zumtl.com/fr/', NULL, 'Pré-incubation, incubation, croissance, soft-landing', 'Mentorat, ateliers, lab 5G, espaces de travail', 'Startups créatives et technologiques', 'Non spécifié', 'Méthodologie MIT VMS, industries créatives', '[]', 'Zú propulse les entreprises qui transforment les industries du divertissement, de l’hospitalité et du sport grâce à des technologies innovantes.', NULL, '{"tiktok": null, "twitter": null, "youtube": "https://www.youtube.com/channel/UC-2C7pRnbIkWQlUdHnUgVkA", "facebook": "https://www.facebook.com/zumtl/", "linkedin": "https://www.linkedin.com/company/zu-mtl/", "instagram": "https://www.instagram.com/zumtl/"}', '2025-11-16 04:12:46.573997+00', '2025-11-16 04:12:46.573997+00', NULL, '["Incubation & accélération"]'),
	('founder-institute-global-montreal-chapter', 'Founder Institute (global) - Montréal chapter', 'Incubation & accélération', 'Accélérateur international (privé)', 'Montréal (UdeM)', 'Montréal', 'Montréal', 'https://fi.co/', 'Multi', 'Application en ligne; éligibilité selon stage', 'Programme de 4 mois, mentorat hebdomadaire, communauté', 'Fonders en pré-seed', 'See site', 'Programme standard global', '[]', 'Since 2009, the world’s fastest-growing startups have used the Founder Institute to raise funding, get into seed-accelerators, generate traction, and more.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/founder-institute-global-montreal-chapter.jpg', '{"tiktok": null, "twitter": "http://founderx.com/", "youtube": "https://www.youtube.com/c/founderinstitute", "facebook": "https://www.facebook.com/FounderInstitute", "linkedin": "https://www.linkedin.com/in/cfishe02/", "instagram": "https://www.instagram.com/founding"}', '2025-11-16 04:12:44.493207+00', '2025-11-16 04:12:44.493207+00', NULL, '["Incubation & accélération"]'),
	('la-base-entrepreneuriale-hec-montreal', 'La base entrepreneuriale HEC Montréal', 'Incubation & accélération', 'Accélérateur universitaire', NULL, 'Montréal', 'Montréal', 'https://labase.hec.ca', NULL, 'Accompagnement technologique et d’impact', 'Mentorat, ateliers, réseautage', 'Étudiants et diplômés HEC Montréal', 'labase.info@hec.ca', 'Hub d’innovation universitaire', '[]', 'Bâtis ton succès! Recrutement en cours! Déposez votre dossier Découvrir nos parcours Hub d’innovation universitaire propulsant la relève en entrepreneuriat technologique et d’impact À La base entrepreneuriale HEC Montréal, la mission est claire : inspirer et propulser l’entrepreneuriat à impact économique et sociétal et l’entrepreneuriat technologique, tant au Québec qu’à l’international. La base est convaincue […]', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/la-base-entrepreneuriale-hec-montreal.jpg', '{"tiktok": null, "twitter": null, "youtube": null, "facebook": null, "linkedin": null, "instagram": null}', '2025-11-16 04:12:45.095314+00', '2025-11-16 04:12:45.095314+00', NULL, '["Incubation & accélération"]'),
	('tandemlaunch', 'TandemLaunch', 'Incubation & accélération', 'Fonds de capital-risque et startup foundry', NULL, 'Montréal', 'Montréal', 'https://www.tandemlaunch.com', NULL, 'Programme de 52 semaines', 'Création de startups deep tech', 'Entrepreneurs ambitieux', 'Non spécifié', '44 investissements, 3 sorties', '[]', 'TandemLaunch est un agent de financement de départ avec un modèle unique de studio de création de jeunes entreprises. Nous nous spécialisons dans la création d’entreprises prospères qui servent tous les intervenants concernés, y compris les cofondateurs, les investisseurs et les inventeurs de technologies.', NULL, '{"tiktok": null, "twitter": "https://algolux.com/", "youtube": "https://www.youtube.com/@tandemlaunch", "facebook": "https://www.facebook.com/TandemLaunchInc", "linkedin": "https://www.linkedin.com/company/tandemlaunch/", "instagram": null}', '2025-11-16 04:12:46.349226+00', '2025-11-16 04:12:46.349226+00', NULL, '["Incubation & accélération"]'),
	('cqib-centre-quebecois-d-innovation-en-biotechnologie', 'CQIB - Centre québécois d''innovation en biotechnologie', 'Incubation & accélération', 'OBNL', 'Laval', 'Laval', 'Laval', 'https://cqib.org', 'Biotechnologie', 'Sélection par projet', 'Laboratoires, mentorat, financement', 'Startups biotech', 'info@cqib.org', 'Expertise en sciences de la vie', '[]', 'Ce qui nous distingue, nos laboratoires et équipements à la fine pointe de la technologie.  En plus de fournir des laboratoires, des bureaux, un parc d''équipements.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/cqib-centre-quebecois-d-innovation-en-biotechnologie.jpg', '{"tiktok": null, "twitter": "https://twitter.com/intent/tweet?url=https://www.cqib.org/d-tails-et-inscription/4e-edition-du-forum-des-financement-des-sciences-de-la-vie?lang=fr&text=D%C3%A9couvrez%20cet%20%C3%A9v%C3%A9nement.%20J%27esp%C3%A8re%20vous%20y%20voir.", "youtube": "https://www.youtube.com/watch?v=0-ZeooIzGko", "facebook": "https://www.facebook.com/sharer/sharer.php?u=https://www.cqib.org/d-tails-et-inscription/4e-edition-du-forum-des-financement-des-sciences-de-la-vie?lang=fr&quote=D%C3%A9couvrez%20cet%20%C3%A9v%C3%A9nement.%20J%27esp%C3%A8re%20vous%20y%20voir.", "linkedin": "https://www.linkedin.com/company/cqiborg", "instagram": null}', '2025-11-16 04:12:43.65116+00', '2025-11-16 04:12:43.65116+00', NULL, '["Incubation & accélération"]'),
	('centre-d-entrepreneuriat-esg-uqam', 'Centre d''entrepreneuriat - ESG UQAM', 'Formation & développement de compétences', 'Université (UQAM)', 'Montréal', 'Montréal', 'Montréal', 'https://centreentrepreneuriat.esg.uqam.ca/', 'Multi', 'Inscription en ligne; services campus', 'Rencontres personnalisées, ateliers, soutien', 'Étudiants et entrepreneurs', 'Voir site', 'Nouveau pavillon entrepreneurship (2025)', '[]', 'Mon entreprise Le concours Mon Entreprise a pour objectif de soutenir les projets d’entrepreneuriat à l’UQAM. En savoir plus Bienvenue au Centre d’entrepreneuriat ESG UQAM Découvrez notre plateforme de maillage Notre mission est de stimuler l’innovation et l’entrepreneuriat responsables en offrant des ressources et un réseau aux entrepreneur.e.s, afin de favoriser la création d’entreprises à […]', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/centre-d-entrepreneuriat-esg-uqam.jpg', '{"tiktok": null, "twitter": null, "youtube": null, "facebook": "https://www.facebook.com/CEesguqam/", "linkedin": "https://www.linkedin.com/company/centre-entrepreneuriat-esg-uqam/", "instagram": "https://www.instagram.com/ceesg.uqam/"}', '2025-11-16 04:12:43.396133+00', '2025-11-16 04:12:43.396133+00', NULL, '["Formation & développement de compétences"]'),
	('nextai-next-canada', 'NextAI (NEXT Canada)', 'Incubation & accélération', 'Programme national (NEXT Canada)', 'Canada', 'Canada', 'Canada', 'https://www.nextcanada.com/next-ai/', 'IA / Tech', 'Sélection par candidature', 'Formation, mentorat, financement initial, réseau', 'Founders IA', 'See site', 'Part of NEXT Canada suite', '[]', NULL, 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/nextai-next-canada.jpg', '{"tiktok": null, "twitter": "https://twitter.com/next_canada", "youtube": null, "facebook": "https://facebook.com/nextcanadaorg", "linkedin": "https://www.linkedin.com/company/next-canada/", "instagram": "https://www.instagram.com/next_canada/"}', '2025-11-16 04:12:45.686274+00', '2025-11-16 04:12:45.686274+00', NULL, '["Incubation & accélération"]'),
	('sadc-cae-reseau-regional', 'SADC / CAE (Réseau régional)', 'Soutien global de croissance & planification stratégique', 'Réseau régional (SADC/CAE)', 'Québec', 'Québec (Hors Montréal)', 'Québec (Hors Montréal)', 'https://www.sadc.ca/', 'Multi', 'Contact local', 'Coaching, microcrédit, accompagnement territorial', 'Entrepreneurs ruraux', 'Voir site', 'Ressources régionales', '[]', 'Nous sommes la société d’État qui encourage la stabilité du système financier canadien en fournissant une assurance contre la perte des dépôts assurables détenus par nos institutions membres en cas de faillite de l’une d’entre elles.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/sadc-cae-reseau-regional.png', '{"tiktok": null, "twitter": "https://twitter.com/sadc_ca", "youtube": "https://www.youtube.com/user/chaineSADC", "facebook": "https://www.facebook.com/SADCCDIC/", "linkedin": "https://www.linkedin.com/company/canada-deposit-insurance-corporation", "instagram": "https://www.instagram.com/sadccdic/"}', '2025-11-16 04:12:46.054448+00', '2025-11-16 04:12:46.054448+00', NULL, '["Soutien global de croissance & planification stratégique"]'),
	('canada-business-services-d-information', 'Canada Business (services d''information)', 'Support administratif / réglementaire', 'Fédéral (gov)', 'Canada (Toronto)', 'Canada', 'Canada', 'https://www.canada.ca/en/services/business.html', 'Multi', 'Accès libre', 'Guides, checklists, orientation', 'Toutes entreprises', 'voir site', 'Portail officiel pour démarches', '[]', 'Renseignements à l''intention des entreprises sur les exigences en matière de tarifs et de taxes, les permis, les règlements, la propriété intellectuelle et le droit d''auteur, ainsi que la façon de financer une entreprise ou de constituer celle-ci en société, d''embaucher des employés ou de faire affaire avec le gouvernement.', NULL, '{"tiktok": null, "twitter": "https://twitter.com/EntreprisesCan", "youtube": null, "facebook": "https://www.facebook.com/EntreprisesCanada", "linkedin": null, "instagram": "https://www.instagram.com/entreprisescdn/"}', '2025-11-16 04:12:43.047827+00', '2025-11-16 04:12:43.047827+00', NULL, '["Support administratif / réglementaire"]'),
	('founder-institute-montreal-chapter', 'Founder Institute (Montréal chapter)', 'Incubation & accélération', 'Accélérateur international (privé)', 'Montréal', 'Montréal', 'Montréal', 'https://fi.co/', 'Multi', 'Application en ligne', 'Programme pre-seed, mentorat hebdo, réseaux', 'Fondateurs en phase d''idée/pré-seed', 'Voir site', 'Programme global adapté localement', '[]', 'Since 2009, the world’s fastest-growing startups have used the Founder Institute to raise funding, get into seed-accelerators, generate traction, and more.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/founder-institute-montreal-chapter.jpg', '{"tiktok": null, "twitter": "http://founderx.com/", "youtube": "https://www.youtube.com/c/founderinstitute", "facebook": "https://www.facebook.com/FounderInstitute", "linkedin": "https://www.linkedin.com/in/cfishe02/", "instagram": "https://www.instagram.com/founding"}', '2025-11-16 04:12:44.552882+00', '2025-11-16 04:12:44.552882+00', NULL, '["Incubation & accélération"]'),
	('mars-discovery-district', 'MaRS Discovery District', 'Incubation & accélération', 'Incubateur / OBNL', 'Canada (national)', 'Canada', 'Canada', 'https://www.marsdd.com/', 'Tech, santé, cleantech, fintech', 'Adhésion / candidature selon programme', 'Mentorat, recherche de marché, accès investisseurs, programmes d''accélération', 'Startups tech & scaleups', 'See site', 'Programmes sectoriels; ressources pour commercialisation', '[]', 'MaRS s’est engagé à servir la communauté francophone au meilleur de nos capacités. Pour obtenir des renseignements en français sur nos programmes,', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/mars-discovery-district.png', '{"tiktok": "https://www.tiktok.com/@marsdiscoverydistrict", "twitter": "https://twitter.com/MaRSDD", "youtube": "https://www.youtube.com/c/MaRSDiscoveryDistrict", "facebook": "https://www.facebook.com/MaRSDiscoveryDistrict", "linkedin": "http://www.linkedin.com/company/mars-discovery-district", "instagram": "https://instagram.com/marsdiscoverydistrict"}', '2025-11-16 04:12:45.524711+00', '2025-11-16 04:12:45.524711+00', NULL, '["Incubation & accélération"]'),
	('district-3-innovation-center', 'District 3 Innovation Center', 'Incubation & accélération', 'OBNL', 'Montréal (Concordia)', 'Montréal (Concordia)', 'Montréal (Concordia)', 'https://www.district3.co', 'Technologie, santé, innovation sociale', 'Postuler via site, projet innovant', 'Coaching, mentorat, accès lab, financement, réseau', 'Startups early-stage', 'hello@district3.co', 'Plus de 1300 startups accompagnées', '[]', 'Nous aidons les personnes à transformer leurs idées en startups, les startups en entreprises, et les entreprises en impact mondial. Basé à Montréal. Postulez dès aujourd’hui à District 3.', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/district-3-innovation-center.jpg', '{"tiktok": null, "twitter": null, "youtube": "https://youtube.com/@d3innovationhub", "facebook": "https://www.facebook.com/District3innovation", "linkedin": "https://www.linkedin.com/company/2858911/", "instagram": "https://www.instagram.com/district3innovation/"}', '2025-11-16 04:12:43.767803+00', '2025-11-16 04:12:43.767803+00', NULL, '["Incubation & accélération"]'),
	('startup-canada', 'Startup Canada', 'Réseautage & communauté', 'OBNL / Réseau', 'Canada (national)', 'Canada', 'Canada', 'https://www.startupcan.ca/', 'Multi', 'Inscription aux événements', 'Bootcamps, mentorat, événements', 'Entrepreneurs en démarrage', 'Voir site', 'Réseau national', '[]', 'Les programmes phares de Startup Canada sont de retour pour fournir à la communauté entrepreneuriale canadienne les outils, le milieu et le soutien nécessaires pour développer des entreprises. Des activités et des ressources gratuites seront offertes à longueur d’année dans le cadre des programmes Startup Women, Startup Global et Startup Gov, et par l’entremise de', 'https://qdtyuaxcdddomixqndmc.supabase.co/storage/v1/object/public/resources/startup-canada.png', '{"tiktok": "https://www.tiktok.com/@startupcanada", "twitter": "https://twitter.com/Startup_Canada", "youtube": "https://www.youtube.com/channel/UCeZeIWVcA0LYAC6EmA4pRUg", "facebook": "https://www.facebook.com/StartupCanada/", "linkedin": "https://www.linkedin.com/company/2512103/admin/", "instagram": "https://www.instagram.com/startupcanada/?hl=en"}', '2025-11-16 04:12:46.249618+00', '2025-11-16 04:12:46.249618+00', NULL, '["Réseautage & communauté"]');


--
-- Data for Name: resource_resource_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."resource_resource_types" ("resource_slug", "resource_type_id") VALUES
	('canada-digital-adoption-program-cdap', 1),
	('zu-montreal', 2),
	('edc-trade-accelerator-program-tap', 1),
	('groupe-3737', 2),
	('founder-institute-montreal-chapter', 2),
	('brain-canada', 2),
	('hacking-health-accelerator', 2),
	('sadc-cae-reseau-regional', 12),
	('founder-institute-global-montreal-chapter', 2),
	('sheeo-coralus-anciennement-sheeo', 1),
	('sodec-soutien-culture-tourisme', 12),
	('ecofuel', 2),
	('republique-entrepreneurs-incubateur-social', 2),
	('hec-montreal-la-base-entrepreneuriale', 2),
	('black-opportunity-fund-black-entrepreneur-program', 1),
	('les-affutes-makerspace-montreal', 10),
	('tandemlaunch', 2),
	('yaroka-technologies', 2),
	('cqib-centre-quebecois-d-innovation-en-biotechnologie', 2),
	('innovation-canada-portail', 4),
	('echofab-fab-lab-du-qi-de-montreal', 8),
	('promontreal-entrepreneurs-pme', 2),
	('dmz-toronto', 2),
	('espace-entrepreneuriat-collectif', 2),
	('centech', 2),
	('tourisme-montreal-programmes-ressources', 5),
	('execution-labs', 2),
	('le-camp', 2),
	('canexport-smes', 7),
	('centre-de-developpement-bioalimentaire-du-quebec-cdbq', 2),
	('bdc-women-in-business-programs-for-women', 1),
	('centre-quebecois-d-innovation-en-biotechnologie-cqib', 11),
	('centre-d-entrepreneuriat-esg-uqam', 3),
	('mentor-canada', 1),
	('reseau-mentorat-quebec', 1),
	('dobson-centre-for-entrepreneurship-mcgill', 2),
	('la-piscine-montreal', 2),
	('garage-co', 2),
	('esplanade-quebec', 9),
	('lespacemaker', 8),
	('le-germoir', 2),
	('creative-destruction-lab-cdl-montreal', 1),
	('nextai-next-canada', 2),
	('la-shop', 2),
	('ceim-centech', 2),
	('district-3-innovation-center', 2),
	('canada-business-services-d-information', 6),
	('femmessor-quebec', 1),
	('founderfuel', 2),
	('pme-mtl-services-d-accompagnement', 5),
	('women-entrepreneurship-knowledge-hub-wekh', 4),
	('mt-lab', 2),
	('futurpreneur-canada', 4),
	('nrc-irap', 5),
	('ag-bio-centre', 2),
	('bonjourstartup-programmes-ressources', 4),
	('hub-ia-innovation-en-ia', 10),
	('la-base-entrepreneuriale-hec-montreal', 2),
	('aqc-capital', 2),
	('startup-canada', 4),
	('millenium-quebecor-universite-de-montreal', 1),
	('c2mi-miqro-innovation', 8),
	('startup-montreal-reseau', 4),
	('ecole-des-entrepreneurs-du-quebec', 3),
	('centre-d-innovation-sociale-institut-various', 3),
	('bdc-advisory-services', 1),
	('futurpreneur-canada', 1),
	('copl-inrs-alls', 10),
	('la-chambre-de-commerce-du-montreal-metropolitain-ccmm', 4),
	('mars-discovery-district', 2),
	('fondation-de-l-entrepreneurship-quebec', 4);


--
-- Data for Name: social_media; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."social_media" ("id", "resource_slug", "platform", "url", "created_at") VALUES
	(1, 'apollo13', 'linkedin', 'https://www.linkedin.com/company/apollo13/', '2025-11-16 04:27:55.475571+00'),
	(2, 'bdc-advisory-services', 'linkedin', 'http://www.linkedin.com/companies/bdc?trk=fc_badge', '2025-11-16 04:27:55.475571+00'),
	(3, 'black-opportunity-fund-black-entrepreneur-program', 'linkedin', 'https://www.linkedin.com/company/68219088', '2025-11-16 04:27:55.475571+00'),
	(4, 'brain-canada', 'linkedin', 'http://www.linkedin.com/company/brain-canada', '2025-11-16 04:27:55.475571+00'),
	(5, 'canexport-smes', 'linkedin', 'https://www.linkedin.com/company/tcssdc', '2025-11-16 04:27:55.475571+00'),
	(6, 'ceim-centech', 'linkedin', 'https://www.linkedin.com/company/ceim', '2025-11-16 04:27:55.475571+00'),
	(7, 'centech', 'linkedin', 'https://www.linkedin.com/company/centech-mtl?trk=extra_biz_viewers_viewed', '2025-11-16 04:27:55.475571+00'),
	(8, 'centre-de-developpement-bioalimentaire-du-quebec-cdbq', 'linkedin', 'https://ca.linkedin.com/company/centre-de-developpement-bioalimentaire-du-quebec/', '2025-11-16 04:27:55.475571+00'),
	(9, 'centre-d-entrepreneuriat-esg-uqam', 'linkedin', 'https://www.linkedin.com/company/centre-entrepreneuriat-esg-uqam/', '2025-11-16 04:27:55.475571+00'),
	(10, 'cqib-centre-quebecois-d-innovation-en-biotechnologie', 'linkedin', 'https://www.linkedin.com/company/cqiborg', '2025-11-16 04:27:55.475571+00'),
	(11, 'creative-destruction-lab-cdl-montreal', 'linkedin', 'https://www.linkedin.com/company/11209954/', '2025-11-16 04:27:55.475571+00'),
	(12, 'district-3-innovation-center', 'linkedin', 'https://www.linkedin.com/company/2858911/', '2025-11-16 04:27:55.475571+00'),
	(13, 'dmz-toronto', 'linkedin', 'https://www.linkedin.com/company/dmzhq/', '2025-11-16 04:27:55.475571+00'),
	(14, 'dobson-centre-for-entrepreneurship-mcgill', 'linkedin', 'https://www.linkedin.com/school/mcgill-university/', '2025-11-16 04:27:55.475571+00'),
	(15, 'esplanade-quebec', 'linkedin', 'https://www.linkedin.com/company/esplanade-montr%C3%A9al/', '2025-11-16 04:27:55.475571+00'),
	(16, 'femmessor-quebec', 'linkedin', 'https://www.linkedin.com/company/evolfinancement/', '2025-11-16 04:27:55.475571+00'),
	(17, 'founder-institute-global-montreal-chapter', 'linkedin', 'https://www.linkedin.com/in/cfishe02/', '2025-11-16 04:27:55.475571+00'),
	(18, 'founder-institute-montreal-chapter', 'linkedin', 'https://www.linkedin.com/in/cfishe02/', '2025-11-16 04:27:55.475571+00'),
	(19, 'founderfuel', 'linkedin', 'https://www.linkedin.com/company/founderfuel/', '2025-11-16 04:27:55.475571+00'),
	(20, 'futurpreneur-canada', 'linkedin', 'https://www.linkedin.com/company/futurpreneur-canada', '2025-11-16 04:27:55.475571+00'),
	(21, 'garage-co', 'linkedin', 'https://www.linkedin.com/company/garageincubateur/', '2025-11-16 04:27:55.475571+00'),
	(22, 'groupe-3737', 'linkedin', 'https://www.linkedin.com/company/groupe-3737/', '2025-11-16 04:27:55.475571+00'),
	(23, 'la-chambre-de-commerce-du-montreal-metropolitain-ccmm', 'linkedin', 'https://www.linkedin.com/company/chambre-de-commerce-du-montreal-m-tropolitain/mycompany/?viewAsMember=true', '2025-11-16 04:27:55.475571+00'),
	(24, 'la-piscine-montreal', 'linkedin', 'https://www.linkedin.com/company/lapiscinemtl/', '2025-11-16 04:27:55.475571+00'),
	(25, 'mars-discovery-district', 'linkedin', 'http://www.linkedin.com/company/mars-discovery-district', '2025-11-16 04:27:55.475571+00'),
	(26, 'millenium-quebecor-universite-de-montreal', 'linkedin', 'https://www.linkedin.com/company/milleniumquebecor/?viewAsMember=true', '2025-11-16 04:27:55.475571+00'),
	(27, 'mt-lab', 'linkedin', 'https://linkedin.com/company/mt-lab', '2025-11-16 04:27:55.475571+00'),
	(28, 'nextai-next-canada', 'linkedin', 'https://www.linkedin.com/company/next-canada/', '2025-11-16 04:27:55.475571+00'),
	(29, 'nrc-irap', 'linkedin', 'http://www.linkedin.com/company/8417?trk=tyah', '2025-11-16 04:27:55.475571+00'),
	(30, 'pme-mtl-services-d-accompagnement', 'linkedin', 'https://www.linkedin.com/company/pme-mtl/', '2025-11-16 04:27:55.475571+00'),
	(31, 'sadc-cae-reseau-regional', 'linkedin', 'https://www.linkedin.com/company/canada-deposit-insurance-corporation', '2025-11-16 04:27:55.475571+00'),
	(32, 'sheeo-coralus-anciennement-sheeo', 'linkedin', 'https://www.linkedin.com/company/sheeo-world/', '2025-11-16 04:27:55.475571+00'),
	(33, 'sodec-soutien-culture-tourisme', 'linkedin', 'https://www.linkedin.com/company/sodec', '2025-11-16 04:27:55.475571+00'),
	(34, 'startup-canada', 'linkedin', 'https://www.linkedin.com/company/2512103/admin/', '2025-11-16 04:27:55.475571+00'),
	(35, 'startup-montreal-reseau', 'linkedin', 'https://linkedin.com/company/quebectech', '2025-11-16 04:27:55.475571+00'),
	(36, 'tandemlaunch', 'linkedin', 'https://www.linkedin.com/company/tandemlaunch/', '2025-11-16 04:27:55.475571+00'),
	(37, 'women-entrepreneurship-knowledge-hub-wekh', 'linkedin', 'https://www.linkedin.com/company/wekh-pcfe/', '2025-11-16 04:27:55.475571+00'),
	(38, 'zu-montreal', 'linkedin', 'https://www.linkedin.com/company/zu-mtl/', '2025-11-16 04:27:55.475571+00'),
	(39, 'mentor-canada', 'linkedin', 'https://www.linkedin.com/company/next-canada/', '2025-11-16 04:27:55.475571+00'),
	(40, 'apollo13', 'instagram', 'https://www.instagram.com/a13startups/', '2025-11-16 04:27:55.475571+00'),
	(41, 'bdc-advisory-services', 'instagram', 'https://www.instagram.com/bdc_ca', '2025-11-16 04:27:55.475571+00'),
	(42, 'black-opportunity-fund-black-entrepreneur-program', 'instagram', 'https://instagram.com/BlkOpportunity', '2025-11-16 04:27:55.475571+00'),
	(43, 'brain-canada', 'instagram', 'https://www.instagram.com/braincanada/', '2025-11-16 04:27:55.475571+00'),
	(44, 'canada-business-services-d-information', 'instagram', 'https://www.instagram.com/entreprisescdn/', '2025-11-16 04:27:55.475571+00'),
	(45, 'ceim-centech', 'instagram', 'https://www.instagram.com/ceim.incubateur/', '2025-11-16 04:27:55.475571+00'),
	(46, 'centech', 'instagram', 'https://www.instagram.com/centechmtl/', '2025-11-16 04:27:55.475571+00'),
	(47, 'centre-d-entrepreneuriat-esg-uqam', 'instagram', 'https://www.instagram.com/ceesg.uqam/', '2025-11-16 04:27:55.475571+00'),
	(48, 'creative-destruction-lab-cdl-montreal', 'instagram', 'https://www.instagram.com/creativedestructionlab/?hl=en', '2025-11-16 04:27:55.475571+00'),
	(49, 'district-3-innovation-center', 'instagram', 'https://www.instagram.com/district3innovation/', '2025-11-16 04:27:55.475571+00'),
	(50, 'dmz-toronto', 'instagram', 'https://www.instagram.com/dmzhq', '2025-11-16 04:27:55.475571+00'),
	(51, 'dobson-centre-for-entrepreneurship-mcgill', 'instagram', 'https://www.instagram.com/mcgillu/', '2025-11-16 04:27:55.475571+00'),
	(52, 'esplanade-quebec', 'instagram', 'https://www.instagram.com/esplanade_qc/', '2025-11-16 04:27:55.475571+00'),
	(53, 'founder-institute-global-montreal-chapter', 'instagram', 'https://www.instagram.com/founding', '2025-11-16 04:27:55.475571+00'),
	(54, 'founder-institute-montreal-chapter', 'instagram', 'https://www.instagram.com/founding', '2025-11-16 04:27:55.475571+00'),
	(55, 'founderfuel', 'instagram', 'https://www.instagram.com/founderfuel/', '2025-11-16 04:27:55.475571+00'),
	(56, 'futurpreneur-canada', 'instagram', 'https://www.instagram.com/futurpreneur', '2025-11-16 04:27:55.475571+00'),
	(57, 'garage-co', 'instagram', 'https://www.instagram.com/garageincubation/', '2025-11-16 04:27:55.475571+00'),
	(58, 'groupe-3737', 'instagram', 'https://www.instagram.com/groupe3737/', '2025-11-16 04:27:55.475571+00'),
	(59, 'la-piscine-montreal', 'instagram', 'https://www.instagram.com/lapiscinemtl/', '2025-11-16 04:27:55.475571+00'),
	(60, 'mars-discovery-district', 'instagram', 'https://instagram.com/marsdiscoverydistrict', '2025-11-16 04:27:55.475571+00'),
	(61, 'millenium-quebecor-universite-de-montreal', 'instagram', 'https://www.instagram.com/milleniumquebecor', '2025-11-16 04:27:55.475571+00'),
	(62, 'mt-lab', 'instagram', 'https://www.instagram.com/mtlabtourisme/', '2025-11-16 04:27:55.475571+00'),
	(63, 'nextai-next-canada', 'instagram', 'https://www.instagram.com/next_canada/', '2025-11-16 04:27:55.475571+00'),
	(64, 'nrc-irap', 'instagram', 'https://www.instagram.com/nrc_cnrc/', '2025-11-16 04:27:55.475571+00'),
	(65, 'pme-mtl-services-d-accompagnement', 'instagram', 'https://www.instagram.com/pmemtl/', '2025-11-16 04:27:55.475571+00'),
	(66, 'sadc-cae-reseau-regional', 'instagram', 'https://www.instagram.com/sadccdic/', '2025-11-16 04:27:55.475571+00'),
	(67, 'sheeo-coralus-anciennement-sheeo', 'instagram', 'https://www.instagram.com/coralus.world', '2025-11-16 04:27:55.475571+00'),
	(68, 'sodec-soutien-culture-tourisme', 'instagram', 'https://www.instagram.com/la.sodec', '2025-11-16 04:27:55.475571+00'),
	(69, 'startup-canada', 'instagram', 'https://www.instagram.com/startupcanada/?hl=en', '2025-11-16 04:27:55.475571+00'),
	(70, 'startup-montreal-reseau', 'instagram', 'https://www.instagram.com/quebec_tech', '2025-11-16 04:27:55.475571+00'),
	(71, 'women-entrepreneurship-knowledge-hub-wekh', 'instagram', 'https://www.instagram.com/wekh_pcfe/', '2025-11-16 04:27:55.475571+00'),
	(72, 'zu-montreal', 'instagram', 'https://www.instagram.com/zumtl/', '2025-11-16 04:27:55.475571+00'),
	(73, 'mentor-canada', 'instagram', 'https://www.instagram.com/next_canada/', '2025-11-16 04:27:55.475571+00'),
	(74, 'apollo13', 'facebook', 'https://www.facebook.com/apollo13startups/', '2025-11-16 04:27:55.475571+00'),
	(75, 'bdc-advisory-services', 'facebook', 'http://www.facebook.com/bdc.ca', '2025-11-16 04:27:55.475571+00'),
	(76, 'black-opportunity-fund-black-entrepreneur-program', 'facebook', 'https://www.facebook.com/BlackOpportunityFund/', '2025-11-16 04:27:55.475571+00'),
	(77, 'brain-canada', 'facebook', 'https://www.facebook.com/brain.canada/', '2025-11-16 04:27:55.475571+00'),
	(78, 'canada-business-services-d-information', 'facebook', 'https://www.facebook.com/EntreprisesCanada', '2025-11-16 04:27:55.475571+00'),
	(79, 'ceim-centech', 'facebook', 'https://www.facebook.com/CEIMincubateur/', '2025-11-16 04:27:55.475571+00'),
	(80, 'centech', 'facebook', 'https://www.facebook.com/CentechMtl/', '2025-11-16 04:27:55.475571+00'),
	(81, 'centre-de-developpement-bioalimentaire-du-quebec-cdbq', 'facebook', 'https://www.facebook.com/centrededeveloppementbioalimentaireduquebec/', '2025-11-16 04:27:55.475571+00'),
	(82, 'centre-d-entrepreneuriat-esg-uqam', 'facebook', 'https://www.facebook.com/CEesguqam/', '2025-11-16 04:27:55.475571+00'),
	(83, 'cqib-centre-quebecois-d-innovation-en-biotechnologie', 'facebook', 'https://www.facebook.com/sharer/sharer.php?u=https://www.cqib.org/d-tails-et-inscription/4e-edition-du-forum-des-financement-des-sciences-de-la-vie?lang=fr&quote=D%C3%A9couvrez%20cet%20%C3%A9v%C3%A9nement.%20J%27esp%C3%A8re%20vous%20y%20voir.', '2025-11-16 04:27:55.475571+00'),
	(84, 'creative-destruction-lab-cdl-montreal', 'facebook', 'https://www.facebook.com/creativedestructionlab/', '2025-11-16 04:27:55.475571+00'),
	(85, 'district-3-innovation-center', 'facebook', 'https://www.facebook.com/District3innovation', '2025-11-16 04:27:55.475571+00'),
	(86, 'dmz-toronto', 'facebook', 'https://www.facebook.com/DMZHQ/', '2025-11-16 04:27:55.475571+00'),
	(87, 'dobson-centre-for-entrepreneurship-mcgill', 'facebook', 'https://www.facebook.com/McGillUniversity', '2025-11-16 04:27:55.475571+00'),
	(88, 'esplanade-quebec', 'facebook', 'https://www.facebook.com/esplanade.quebec', '2025-11-16 04:27:55.475571+00'),
	(89, 'femmessor-quebec', 'facebook', 'https://www.facebook.com/EvolQC', '2025-11-16 04:27:55.475571+00'),
	(90, 'founder-institute-global-montreal-chapter', 'facebook', 'https://www.facebook.com/FounderInstitute', '2025-11-16 04:27:55.475571+00'),
	(91, 'founder-institute-montreal-chapter', 'facebook', 'https://www.facebook.com/FounderInstitute', '2025-11-16 04:27:55.475571+00'),
	(92, 'founderfuel', 'facebook', 'https://www.facebook.com/FounderFuel/', '2025-11-16 04:27:55.475571+00'),
	(93, 'futurpreneur-canada', 'facebook', 'https://www.facebook.com/Futurpreneur', '2025-11-16 04:27:55.475571+00'),
	(94, 'groupe-3737', 'facebook', 'https://www.facebook.com/profile.php?id=61565310930498', '2025-11-16 04:27:55.475571+00'),
	(95, 'la-chambre-de-commerce-du-montreal-metropolitain-ccmm', 'facebook', 'https://www.facebook.com/chambremontreal', '2025-11-16 04:27:55.475571+00'),
	(96, 'la-piscine-montreal', 'facebook', 'https://www.facebook.com/LaPiscineMTL/', '2025-11-16 04:27:55.475571+00'),
	(97, 'mars-discovery-district', 'facebook', 'https://www.facebook.com/MaRSDiscoveryDistrict', '2025-11-16 04:27:55.475571+00'),
	(98, 'millenium-quebecor-universite-de-montreal', 'facebook', 'https://www.facebook.com/Milleniumquebecor', '2025-11-16 04:27:55.475571+00'),
	(99, 'mt-lab', 'facebook', 'https://www.facebook.com/MTlabTourisme', '2025-11-16 04:27:55.475571+00'),
	(100, 'nextai-next-canada', 'facebook', 'https://facebook.com/nextcanadaorg', '2025-11-16 04:27:55.475571+00'),
	(101, 'pme-mtl-services-d-accompagnement', 'facebook', 'https://www.facebook.com/PMEMTL', '2025-11-16 04:27:55.475571+00'),
	(102, 'sadc-cae-reseau-regional', 'facebook', 'https://www.facebook.com/SADCCDIC/', '2025-11-16 04:27:55.475571+00'),
	(103, 'sheeo-coralus-anciennement-sheeo', 'facebook', 'https://www.facebook.com/CoralusWorld', '2025-11-16 04:27:55.475571+00'),
	(104, 'sodec-soutien-culture-tourisme', 'facebook', 'https://www.facebook.com/la.sodec', '2025-11-16 04:27:55.475571+00'),
	(105, 'startup-canada', 'facebook', 'https://www.facebook.com/StartupCanada/', '2025-11-16 04:27:55.475571+00'),
	(106, 'startup-montreal-reseau', 'facebook', 'https://www.facebook.com/quebectechqc/', '2025-11-16 04:27:55.475571+00'),
	(107, 'tandemlaunch', 'facebook', 'https://www.facebook.com/TandemLaunchInc', '2025-11-16 04:27:55.475571+00'),
	(108, 'women-entrepreneurship-knowledge-hub-wekh', 'facebook', 'https://www.facebook.com/WEKHPCFE/', '2025-11-16 04:27:55.475571+00'),
	(109, 'zu-montreal', 'facebook', 'https://www.facebook.com/zumtl/', '2025-11-16 04:27:55.475571+00'),
	(110, 'mentor-canada', 'facebook', 'https://facebook.com/nextcanadaorg', '2025-11-16 04:27:55.475571+00'),
	(111, 'apollo13', 'twitter', 'https://twitter.com/a13startups', '2025-11-16 04:27:55.475571+00'),
	(112, 'bdc-advisory-services', 'twitter', 'http://twitter.com/bdc_ca', '2025-11-16 04:27:55.475571+00'),
	(113, 'black-opportunity-fund-black-entrepreneur-program', 'twitter', 'https://twitter.com/BlkOpportunity', '2025-11-16 04:27:55.475571+00'),
	(114, 'brain-canada', 'twitter', 'https://twitter.com/intent/follow?source=followbutton&variant=1.0&screen_name=BrainCanada', '2025-11-16 04:27:55.475571+00'),
	(115, 'canada-business-services-d-information', 'twitter', 'https://twitter.com/EntreprisesCan', '2025-11-16 04:27:55.475571+00'),
	(116, 'canexport-smes', 'twitter', 'https://x.com/TCS_SDC', '2025-11-16 04:27:55.475571+00'),
	(117, 'cqib-centre-quebecois-d-innovation-en-biotechnologie', 'twitter', 'https://twitter.com/intent/tweet?url=https://www.cqib.org/d-tails-et-inscription/4e-edition-du-forum-des-financement-des-sciences-de-la-vie?lang=fr&text=D%C3%A9couvrez%20cet%20%C3%A9v%C3%A9nement.%20J%27esp%C3%A8re%20vous%20y%20voir.', '2025-11-16 04:27:55.475571+00'),
	(118, 'creative-destruction-lab-cdl-montreal', 'twitter', 'https://twitter.com/creativedlab', '2025-11-16 04:27:55.475571+00'),
	(119, 'dmz-toronto', 'twitter', 'https://x.com/dmzhq', '2025-11-16 04:27:55.475571+00'),
	(120, 'dobson-centre-for-entrepreneurship-mcgill', 'twitter', 'https://twitter.com/mcgillu', '2025-11-16 04:27:55.475571+00'),
	(121, 'esplanade-quebec', 'twitter', 'https://twitter.com/esplanadeqc', '2025-11-16 04:27:55.475571+00'),
	(122, 'founder-institute-global-montreal-chapter', 'twitter', 'http://founderx.com/', '2025-11-16 04:27:55.475571+00'),
	(123, 'founder-institute-montreal-chapter', 'twitter', 'http://founderx.com/', '2025-11-16 04:27:55.475571+00'),
	(124, 'founderfuel', 'twitter', 'https://twitter.com/founderfuel', '2025-11-16 04:27:55.475571+00'),
	(125, 'futurpreneur-canada', 'twitter', 'https://twitter.com/Futurpreneur', '2025-11-16 04:27:55.475571+00'),
	(126, 'groupe-3737', 'twitter', 'https://twitter.com/Groupe3737?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor', '2025-11-16 04:27:55.475571+00'),
	(127, 'la-chambre-de-commerce-du-montreal-metropolitain-ccmm', 'twitter', 'https://twitter.com/chambremontreal', '2025-11-16 04:27:55.475571+00'),
	(128, 'mars-discovery-district', 'twitter', 'https://twitter.com/MaRSDD', '2025-11-16 04:27:55.475571+00'),
	(129, 'nextai-next-canada', 'twitter', 'https://twitter.com/next_canada', '2025-11-16 04:27:55.475571+00'),
	(130, 'nrc-irap', 'twitter', 'https://twitter.com/cnrc_nrc', '2025-11-16 04:27:55.475571+00'),
	(131, 'sadc-cae-reseau-regional', 'twitter', 'https://twitter.com/sadc_ca', '2025-11-16 04:27:55.475571+00'),
	(132, 'sheeo-coralus-anciennement-sheeo', 'twitter', 'https://www.twitter.com/coralus_world', '2025-11-16 04:27:55.475571+00'),
	(133, 'startup-canada', 'twitter', 'https://twitter.com/Startup_Canada', '2025-11-16 04:27:55.475571+00'),
	(134, 'startup-montreal-reseau', 'twitter', 'https://x.com/quebectech_', '2025-11-16 04:27:55.475571+00'),
	(135, 'tandemlaunch', 'twitter', 'https://algolux.com/', '2025-11-16 04:27:55.475571+00'),
	(136, 'women-entrepreneurship-knowledge-hub-wekh', 'twitter', 'https://twitter.com/wekh_pcfe', '2025-11-16 04:27:55.475571+00'),
	(137, 'mentor-canada', 'twitter', 'https://twitter.com/next_canada', '2025-11-16 04:27:55.475571+00'),
	(138, 'bdc-advisory-services', 'youtube', 'http://www.youtube.com/BDCBanx', '2025-11-16 04:27:55.475571+00'),
	(139, 'canexport-smes', 'youtube', 'https://www.youtube.com/channel/UC8HnUxC1vYRuPsJkZD-1qGw', '2025-11-16 04:27:55.475571+00'),
	(140, 'ceim-centech', 'youtube', 'https://www.youtube.com/channel/UCz7kallFQwZZMVj1Fil7efg', '2025-11-16 04:27:55.475571+00'),
	(141, 'centech', 'youtube', 'https://www.youtube.com/channel/UCBE0aabDceUdOvd_NtX-jig', '2025-11-16 04:27:55.475571+00'),
	(142, 'cqib-centre-quebecois-d-innovation-en-biotechnologie', 'youtube', 'https://www.youtube.com/watch?v=0-ZeooIzGko', '2025-11-16 04:27:55.475571+00'),
	(143, 'district-3-innovation-center', 'youtube', 'https://youtube.com/@d3innovationhub', '2025-11-16 04:27:55.475571+00'),
	(144, 'dmz-toronto', 'youtube', 'https://www.youtube.com/@dmzhq_', '2025-11-16 04:27:55.475571+00'),
	(145, 'dobson-centre-for-entrepreneurship-mcgill', 'youtube', 'https://www.youtube.com/mcgilluniversity', '2025-11-16 04:27:55.475571+00'),
	(146, 'esplanade-quebec', 'youtube', 'https://www.youtube.com/@esplanadequebec1521', '2025-11-16 04:27:55.475571+00'),
	(147, 'femmessor-quebec', 'youtube', 'https://www.youtube.com/channel/UCtul9JAsLW-vB_KrlGSxHOw', '2025-11-16 04:27:55.475571+00'),
	(148, 'founder-institute-global-montreal-chapter', 'youtube', 'https://www.youtube.com/c/founderinstitute', '2025-11-16 04:27:55.475571+00'),
	(149, 'founder-institute-montreal-chapter', 'youtube', 'https://www.youtube.com/c/founderinstitute', '2025-11-16 04:27:55.475571+00'),
	(150, 'futurpreneur-canada', 'youtube', 'https://www.youtube.com/user/CYBF', '2025-11-16 04:27:55.475571+00'),
	(151, 'groupe-3737', 'youtube', 'https://www.youtube.com/channel/UC2QH8Ea-rq1HF6Jvp_SZnJw', '2025-11-16 04:27:55.475571+00'),
	(152, 'la-chambre-de-commerce-du-montreal-metropolitain-ccmm', 'youtube', 'https://www.youtube.com/channel/UCcKt3yteCzkJ1673Z1Oh8ug?&ab_channel=ChambredecommerceduMontr%C3%A9alm%C3%A9tropolitain', '2025-11-16 04:27:55.475571+00'),
	(153, 'la-piscine-montreal', 'youtube', 'https://www.youtube.com/channel/UC24qrD8O4eMdDhZ6KPwAeIw', '2025-11-16 04:27:55.475571+00'),
	(154, 'mars-discovery-district', 'youtube', 'https://www.youtube.com/c/MaRSDiscoveryDistrict', '2025-11-16 04:27:55.475571+00'),
	(155, 'millenium-quebecor-universite-de-montreal', 'youtube', 'https://www.youtube.com/@Milleniumquebecor', '2025-11-16 04:27:55.475571+00'),
	(156, 'pme-mtl-services-d-accompagnement', 'youtube', 'https://www.youtube.com/channel/UCSBcU913V-y0h9vmOOd4dBg', '2025-11-16 04:27:55.475571+00'),
	(157, 'sadc-cae-reseau-regional', 'youtube', 'https://www.youtube.com/user/chaineSADC', '2025-11-16 04:27:55.475571+00'),
	(158, 'sheeo-coralus-anciennement-sheeo', 'youtube', 'https://www.youtube.com/c/Coralus_World', '2025-11-16 04:27:55.475571+00'),
	(159, 'startup-canada', 'youtube', 'https://www.youtube.com/channel/UCeZeIWVcA0LYAC6EmA4pRUg', '2025-11-16 04:27:55.475571+00'),
	(160, 'startup-montreal-reseau', 'youtube', 'https://www.youtube.com/channel/UCWQKgg8wKsVu3fFMtAIk-5g', '2025-11-16 04:27:55.475571+00'),
	(161, 'tandemlaunch', 'youtube', 'https://www.youtube.com/@tandemlaunch', '2025-11-16 04:27:55.475571+00'),
	(162, 'women-entrepreneurship-knowledge-hub-wekh', 'youtube', 'https://www.youtube.com/channel/UCrAH4PNQ3XCEd3AWFNp9ZsA?feature=emb_ch_name_ex', '2025-11-16 04:27:55.475571+00'),
	(163, 'zu-montreal', 'youtube', 'https://www.youtube.com/channel/UC-2C7pRnbIkWQlUdHnUgVkA', '2025-11-16 04:27:55.475571+00'),
	(164, 'dmz-toronto', 'tiktok', 'https://www.tiktok.com/@dmzhq', '2025-11-16 04:27:55.475571+00'),
	(165, 'mars-discovery-district', 'tiktok', 'https://www.tiktok.com/@marsdiscoverydistrict', '2025-11-16 04:27:55.475571+00'),
	(166, 'startup-canada', 'tiktok', 'https://www.tiktok.com/@startupcanada', '2025-11-16 04:27:55.475571+00'),
	(167, 'quebec-tech-pour-le-succes-des-startups-tech', 'linkedin', 'https://linkedin.com/company/quebectech', '2025-11-16 04:39:36.978656+00'),
	(168, 'quebec-tech-pour-le-succes-des-startups-tech', 'instagram', 'https://www.instagram.com/quebec_tech', '2025-11-16 04:39:36.978656+00'),
	(169, 'quebec-tech-pour-le-succes-des-startups-tech', 'facebook', 'https://www.facebook.com/quebectechqc/', '2025-11-16 04:39:36.978656+00'),
	(170, 'quebec-tech-pour-le-succes-des-startups-tech', 'twitter', 'https://x.com/quebectech_', '2025-11-16 04:39:36.978656+00'),
	(171, 'quebec-tech-pour-le-succes-des-startups-tech', 'youtube', 'https://www.youtube.com/channel/UCWQKgg8wKsVu3fFMtAIk-5g', '2025-11-16 04:39:36.978656+00'),
	(226, 'dobson-centre-for-entrepreneurship-mcgill', 'linkedin', 'https://www.linkedin.com/company/mcgill-dobson-center-for-entrepreneurship', '2025-11-16 04:42:29.559856+00'),
	(227, 'dobson-centre-for-entrepreneurship-mcgill', 'instagram', 'https://www.instagram.com/dobsoncentre/', '2025-11-16 04:42:29.559856+00'),
	(228, 'dobson-centre-for-entrepreneurship-mcgill', 'facebook', 'https://www.facebook.com/DobsonCentre', '2025-11-16 04:42:29.559856+00'),
	(229, 'dobson-centre-for-entrepreneurship-mcgill', 'twitter', 'https://twitter.com/DobsonCentre', '2025-11-16 04:42:29.559856+00'),
	(230, 'dobson-centre-for-entrepreneurship-mcgill', 'youtube', 'https://www.youtube.com/channel/UC1Nr28jEoUr18krlvB2gSDg', '2025-11-16 04:42:29.559856+00'),
	(231, 'ecole-des-entrepreneurs-du-quebec', 'linkedin', 'https://www.linkedin.com/school/ecole-des-entrepreneurs-du-quebec/', '2025-11-16 04:42:30.448676+00'),
	(232, 'ecole-des-entrepreneurs-du-quebec', 'instagram', 'https://www.instagram.com/ecoledesentrepreneursduquebec/', '2025-11-16 04:42:30.448676+00'),
	(233, 'ecole-des-entrepreneurs-du-quebec', 'facebook', 'https://www.facebook.com/eequebec/', '2025-11-16 04:42:30.448676+00'),
	(234, 'ecole-des-entrepreneurs-du-quebec', 'youtube', 'https://www.youtube.com/channel/UCFPWK-KfmlB5yNk65SK-BPw', '2025-11-16 04:42:30.448676+00');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") VALUES
	('db91796f-2251-4467-8f8d-4d7adf5b0690', 'resources', 'bdc-advisory-services.jpg', NULL, '2025-11-16 05:11:29.548988+00', '2025-11-16 05:11:29.548988+00', '2025-11-16 05:11:29.548988+00', '{"eTag": "\"9ad1a4a0319cf8880075b2393db4e7e3\"", "size": 23830, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:30.000Z", "contentLength": 23830, "httpStatusCode": 200}', '9e56026e-4812-4ecb-8ad5-6149a35c10d4', NULL, '{}', 1),
	('52a28fac-f50c-4844-a31e-d1540397c5c2', 'resources', 'brain-canada.png', NULL, '2025-11-16 05:11:29.882751+00', '2025-11-16 05:11:29.882751+00', '2025-11-16 05:11:29.882751+00', '{"eTag": "\"e3245f1f55f32b98d726440ca0bb3fca\"", "size": 30634, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:30.000Z", "contentLength": 30634, "httpStatusCode": 200}', '6f6d7905-88bd-43e4-8eac-5bfae99013ff', NULL, '{}', 1),
	('0d001da2-3ea6-4b0b-9a7e-d63322d5e908', 'resources', 'aqc-capital.png', NULL, '2025-11-16 05:11:30.118578+00', '2025-11-16 05:11:30.118578+00', '2025-11-16 05:11:30.118578+00', '{"eTag": "\"3a6274ddddcccc51b089630d0baa5523\"", "size": 35741, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:31.000Z", "contentLength": 35741, "httpStatusCode": 200}', '7f5d95f8-5ed3-485e-a687-a7bbc3b72201', NULL, '{}', 1),
	('d55e48cb-9ef0-4c87-8dba-a17ac79c653b', 'resources', 'cqib-centre-quebecois-d-innovation-en-biotechnologie.jpg', NULL, '2025-11-16 05:11:30.535405+00', '2025-11-16 05:11:30.535405+00', '2025-11-16 05:11:30.535405+00', '{"eTag": "\"547766cf720b5585c94d60292eafdb55\"", "size": 888978, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:31.000Z", "contentLength": 888978, "httpStatusCode": 200}', '02cea6b5-14c4-430f-acbb-d6459fc35f97', NULL, '{}', 1),
	('b455a369-c5c1-49f0-910a-af96f695c132', 'resources', 'creative-destruction-lab-cdl-montreal.png', NULL, '2025-11-16 05:11:31.260374+00', '2025-11-16 05:11:31.260374+00', '2025-11-16 05:11:31.260374+00', '{"eTag": "\"9b3deb52c551af05e61f77cf54809339\"", "size": 2052064, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:32.000Z", "contentLength": 2052064, "httpStatusCode": 200}', '82f62b9c-8bfa-448f-81c1-1f969c037c07', NULL, '{}', 1),
	('a88cac75-6538-4b9b-89fa-99e545769ef5', 'resources', 'centech.png', NULL, '2025-11-16 05:11:31.490159+00', '2025-11-16 05:11:31.490159+00', '2025-11-16 05:11:31.490159+00', '{"eTag": "\"0d550da02f0914cbf3c673a92984bcc6\"", "size": 42833, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:32.000Z", "contentLength": 42833, "httpStatusCode": 200}', 'b89d0f0a-1d10-4380-9a51-fb000a6fceee', NULL, '{}', 1),
	('13e466e3-f5e9-4afd-8241-9367e4aeb3bc', 'resources', 'femmessor-quebec.jpg', NULL, '2025-11-16 05:11:31.696433+00', '2025-11-16 05:11:31.696433+00', '2025-11-16 05:11:31.696433+00', '{"eTag": "\"2e0761cff58be38f563ae78dcab24a08\"", "size": 33183, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:32.000Z", "contentLength": 33183, "httpStatusCode": 200}', '29e2e8f9-eab5-44d1-8b87-ff9681c7baa4', NULL, '{}', 1),
	('1b2157c8-f230-4f8e-99f4-96fb84eeb833', 'resources', 'dmz-toronto.png', NULL, '2025-11-16 05:11:31.89223+00', '2025-11-16 05:11:31.89223+00', '2025-11-16 05:11:31.89223+00', '{"eTag": "\"c8f0e1267dd396bbe28a419728b314ee\"", "size": 12625, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:32.000Z", "contentLength": 12625, "httpStatusCode": 200}', 'bfeea267-265d-46f7-a78c-038d5fec0c68', NULL, '{}', 1),
	('128c0492-b262-409b-878f-4077bcc3b932', 'resources', 'execution-labs.png', NULL, '2025-11-16 05:11:32.104523+00', '2025-11-16 05:11:32.104523+00', '2025-11-16 05:11:32.104523+00', '{"eTag": "\"9ae03289852af6782f681d41923a0f9f\"", "size": 27571, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:33.000Z", "contentLength": 27571, "httpStatusCode": 200}', '1230eea5-1915-4d7e-8d2c-1a8797e9fafe', NULL, '{}', 1),
	('2c7d291c-65c9-4692-b6ad-b2d038e8c30b', 'resources', 'garage-co.jpg', NULL, '2025-11-16 05:11:32.354208+00', '2025-11-16 05:11:32.354208+00', '2025-11-16 05:11:32.354208+00', '{"eTag": "\"8c51250ff56ffa2578e6ca5f7fc74264\"", "size": 163543, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:33.000Z", "contentLength": 163543, "httpStatusCode": 200}', '4374fa95-1c88-40ef-9406-f4086b1a97d4', NULL, '{}', 1),
	('164cf1e1-d911-4b36-88e2-0513ada4ce19', 'resources', 'founder-institute-montreal-chapter.jpg', NULL, '2025-11-16 05:11:32.631043+00', '2025-11-16 05:11:32.631043+00', '2025-11-16 05:11:32.631043+00', '{"eTag": "\"68ca7bb1acdd6beff09fbe3e6bd2adf8\"", "size": 230789, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:33.000Z", "contentLength": 230789, "httpStatusCode": 200}', '96e55e4b-7296-48ca-bf55-27b08b7b3fb9', NULL, '{}', 1),
	('e09d7598-7f9f-4dd7-a0a7-c8aaf1d3e459', 'resources', 'apollo13.png', NULL, '2025-11-16 05:10:19.192394+00', '2025-11-16 05:13:03.168923+00', '2025-11-16 05:10:19.192394+00', '{"eTag": "\"be292be4aee6dbff5dcec35f8e3cf739\"", "size": 2263899, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:13:04.000Z", "contentLength": 2263899, "httpStatusCode": 200}', '42f4120b-6145-4e0b-b493-a0ea5645becc', NULL, '{}', 1),
	('ba67848d-4e69-4ebe-914b-8821bc2f2dc5', 'resources', 'hec-montreal-la-base-entrepreneuriale.jpg', NULL, '2025-11-16 05:11:32.965591+00', '2025-11-16 05:11:32.965591+00', '2025-11-16 05:11:32.965591+00', '{"eTag": "\"4411ce209ec640595ddab9baee8afd07\"", "size": 148330, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:33.000Z", "contentLength": 148330, "httpStatusCode": 200}', 'f8de15c6-77ff-4580-a56e-3334cea63a9e', NULL, '{}', 1),
	('f245dc2b-0891-4fe2-9a1c-3f54b1b9d9fe', 'resources', 'le-camp.png', NULL, '2025-11-16 05:11:33.806168+00', '2025-11-16 05:11:33.806168+00', '2025-11-16 05:11:33.806168+00', '{"eTag": "\"92c5346fc60d9e8087e06123d1d884fa\"", "size": 3029602, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:34.000Z", "contentLength": 3029602, "httpStatusCode": 200}', '958b5b26-a449-4e80-9d8a-d2bf860e26b8', NULL, '{}', 1),
	('3347f372-a3c5-40c3-8224-7ebfbae5e9dd', 'resources', 'mars-discovery-district.png', NULL, '2025-11-16 05:11:34.283339+00', '2025-11-16 05:11:34.283339+00', '2025-11-16 05:11:34.283339+00', '{"eTag": "\"1302bc8a04058549bcf55b4f90b39b6b\"", "size": 1172052, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:35.000Z", "contentLength": 1172052, "httpStatusCode": 200}', '2210e0d0-3450-4559-9bea-54b1ad7618c8', NULL, '{}', 1),
	('396a9a7e-3189-4d67-962e-765bdd1465da', 'resources', 'millenium-quebecor-universite-de-montreal.png', NULL, '2025-11-16 05:11:35.189728+00', '2025-11-16 05:11:35.189728+00', '2025-11-16 05:11:35.189728+00', '{"eTag": "\"fa52dbdc12155ad53a8f646c9a8bef38\"", "size": 3190223, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:36.000Z", "contentLength": 3190223, "httpStatusCode": 200}', 'b6f7770a-7b39-4ef8-b3ae-6577a84bce7f', NULL, '{}', 1),
	('07b30a17-5557-49ae-a8d8-da24bd006a5c', 'resources', 'mt-lab.jpg', NULL, '2025-11-16 05:11:35.520403+00', '2025-11-16 05:11:35.520403+00', '2025-11-16 05:11:35.520403+00', '{"eTag": "\"7852ea5312a51f5bf0396b308f5dd6c7\"", "size": 643018, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:36.000Z", "contentLength": 643018, "httpStatusCode": 200}', '208bbb59-de4a-4d27-83ec-4deefc939e1d', NULL, '{}', 1),
	('2f274eb1-5393-4487-bf45-200dbfd93b2d', 'resources', 'pme-mtl-services-d-accompagnement.jpg', NULL, '2025-11-16 05:11:35.739273+00', '2025-11-16 05:11:35.739273+00', '2025-11-16 05:11:35.739273+00', '{"eTag": "\"7aa7ad45629870c744ae9ab2cc998b1e\"", "size": 83720, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:36.000Z", "contentLength": 83720, "httpStatusCode": 200}', 'ac054aa6-2a28-4dfb-a332-d4df5e6ec7f0', NULL, '{}', 1),
	('1a6cbd18-dd89-45f1-b605-6eb2fc7c26e9', 'resources', 'sodec-soutien-culture-tourisme.png', NULL, '2025-11-16 05:11:35.968082+00', '2025-11-16 05:11:35.968082+00', '2025-11-16 05:11:35.968082+00', '{"eTag": "\"f32fbc494ccdec35462a9e04a7c51eb0\"", "size": 62872, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:36.000Z", "contentLength": 62872, "httpStatusCode": 200}', '91ce367d-2f75-4db9-ad6e-0a28088a4c3a', NULL, '{}', 1),
	('b8421e79-ee98-4c5d-93f6-c1eb72f58bea', 'resources', 'startup-canada.png', NULL, '2025-11-16 05:11:36.16185+00', '2025-11-16 05:11:36.16185+00', '2025-11-16 05:11:36.16185+00', '{"eTag": "\"b1c2d4b30f22263006e972cbdc1ffc54\"", "size": 4618, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:37.000Z", "contentLength": 4618, "httpStatusCode": 200}', '81af21fe-4047-4231-891a-f380dadbba9c', NULL, '{}', 1),
	('d91dc0a0-f811-4b7f-9071-3e3bc72ce05c', 'resources', 'mentor-canada.jpg', NULL, '2025-11-16 05:11:36.455576+00', '2025-11-16 05:11:36.455576+00', '2025-11-16 05:11:36.455576+00', '{"eTag": "\"9f85be3c7594d83c8147dd70a8f74317\"", "size": 12995, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:37.000Z", "contentLength": 12995, "httpStatusCode": 200}', '54e1c89f-c71e-403e-af6d-7ee96433aaa4', NULL, '{}', 1),
	('72b0fd64-1d61-4748-a866-e320ee71e373', 'resources', 'ceim-centech.png', NULL, '2025-11-16 05:11:36.644009+00', '2025-11-16 05:11:36.644009+00', '2025-11-16 05:11:36.644009+00', '{"eTag": "\"eb409f8cef53fb9ab2b8c5cb45885c49\"", "size": 28327, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:37.000Z", "contentLength": 28327, "httpStatusCode": 200}', '576d54f5-d0d3-4c43-847f-814de78c6ad5', NULL, '{}', 1),
	('d6c9e756-3344-4320-9134-2c7c2eaf21ad', 'resources', 'district-3-innovation-center.jpg', NULL, '2025-11-16 05:11:37.068947+00', '2025-11-16 05:11:37.068947+00', '2025-11-16 05:11:37.068947+00', '{"eTag": "\"dd34b1372a6bd55beeacf2a073ebfe05\"", "size": 655783, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:37.000Z", "contentLength": 655783, "httpStatusCode": 200}', 'acceb7e0-1afa-4e5d-92b9-6b924bbe3f7f', NULL, '{}', 1),
	('b3cac0e3-6773-4c70-a6f9-64159fcce6b5', 'resources', 'women-entrepreneurship-knowledge-hub-wekh.jpg', NULL, '2025-11-16 05:11:37.281777+00', '2025-11-16 05:11:37.281777+00', '2025-11-16 05:11:37.281777+00', '{"eTag": "\"29914309043cf33456437ff51d9247dc\"", "size": 80960, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:38.000Z", "contentLength": 80960, "httpStatusCode": 200}', '8c435a71-ca39-40e6-b5e1-0cf23b74e155', NULL, '{}', 1),
	('893a4b94-cbc1-4bf5-8078-a888993b9b30', 'resources', 'founder-institute-global-montreal-chapter.jpg', NULL, '2025-11-16 05:11:37.614567+00', '2025-11-16 05:11:37.614567+00', '2025-11-16 05:11:37.614567+00', '{"eTag": "\"68ca7bb1acdd6beff09fbe3e6bd2adf8\"", "size": 230789, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:38.000Z", "contentLength": 230789, "httpStatusCode": 200}', 'cf10c37c-b11e-4f64-a234-32e354708a65', NULL, '{}', 1),
	('ad9b29e1-9e90-4251-ac64-bc19f11981bf', 'resources', 'futurpreneur-canada.png', NULL, '2025-11-16 05:11:38.135989+00', '2025-11-16 05:11:38.135989+00', '2025-11-16 05:11:38.135989+00', '{"eTag": "\"f6c4c5bd2f71fc1fd3a00fd439797b54\"", "size": 16147, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:39.000Z", "contentLength": 16147, "httpStatusCode": 200}', '4e085760-baaf-41dc-8ce4-23f99bba8ec5', NULL, '{}', 1),
	('d33a0d74-b3ea-47b9-8157-ef0ff981f965', 'resources', 'la-base-entrepreneuriale-hec-montreal.jpg', NULL, '2025-11-16 05:11:38.459055+00', '2025-11-16 05:11:38.459055+00', '2025-11-16 05:11:38.459055+00', '{"eTag": "\"4411ce209ec640595ddab9baee8afd07\"", "size": 148330, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:39.000Z", "contentLength": 148330, "httpStatusCode": 200}', '34e38285-9eae-41ae-96a3-203d1e659202', NULL, '{}', 1),
	('99cf6160-a788-4ec8-9598-3ca66c2d26b5', 'resources', 'centre-d-entrepreneuriat-esg-uqam.jpg', NULL, '2025-11-16 05:11:38.776943+00', '2025-11-16 05:11:38.776943+00', '2025-11-16 05:11:38.776943+00', '{"eTag": "\"a3161740ae8b3a4fa619ef625cdc65a7\"", "size": 40190, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:39.000Z", "contentLength": 40190, "httpStatusCode": 200}', 'ee6e3376-3414-4864-9b7d-d5ebbf9f349f', NULL, '{}', 1),
	('a5a694a2-a601-40df-b242-c5f0d67a125d', 'resources', 'nextai-next-canada.jpg', NULL, '2025-11-16 05:11:38.984858+00', '2025-11-16 05:11:38.984858+00', '2025-11-16 05:11:38.984858+00', '{"eTag": "\"9f85be3c7594d83c8147dd70a8f74317\"", "size": 12995, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:39.000Z", "contentLength": 12995, "httpStatusCode": 200}', 'acf28fda-f86d-4684-98ff-cec8396d35e9', NULL, '{}', 1),
	('f0e0d763-a529-4eba-8040-1202a5a8e6a5', 'resources', 'sadc-cae-reseau-regional.png', NULL, '2025-11-16 05:11:39.315568+00', '2025-11-16 05:11:39.315568+00', '2025-11-16 05:11:39.315568+00', '{"eTag": "\"e0247a3d253eee977a0209835acf2ecf\"", "size": 668273, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2025-11-16T05:11:40.000Z", "contentLength": 668273, "httpStatusCode": 200}', '88688b1e-7329-4331-97a4-f13678216ce7', NULL, '{}', 1);


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 6, true);


--
-- Name: resource_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."resource_types_id_seq"', 14, true);


--
-- Name: social_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."social_media_id_seq"', 540, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict k7WX47e1H6afBp4t9Cu5yPwZooCVHdFZLJtXlKV3NI7JATAfXGCjccSPyzqOvZ5

RESET ALL;
