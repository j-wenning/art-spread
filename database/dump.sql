--
-- PostgreSQL database dump
--

-- Dumped from database version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.10 (Ubuntu 10.10-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.profiles DROP CONSTRAINT profiles_fk0;
ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_fk0;
ALTER TABLE ONLY public.pools DROP CONSTRAINT pools_fk0;
ALTER TABLE ONLY public.images DROP CONSTRAINT images_fk0;
ALTER TABLE ONLY public.accounts DROP CONSTRAINT accounts_fk0;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pk;
ALTER TABLE ONLY public.profiles DROP CONSTRAINT profiles_pk;
ALTER TABLE ONLY public.posts DROP CONSTRAINT "posts_postId_key";
ALTER TABLE ONLY public.pools DROP CONSTRAINT pools_pk;
ALTER TABLE ONLY public.images DROP CONSTRAINT "images_imageId_key";
ALTER TABLE ONLY public.accounts DROP CONSTRAINT "accounts_accountId_key";
ALTER TABLE public.users ALTER COLUMN "userId" DROP DEFAULT;
ALTER TABLE public.profiles ALTER COLUMN "profileId" DROP DEFAULT;
ALTER TABLE public.posts ALTER COLUMN "postId" DROP DEFAULT;
ALTER TABLE public.pools ALTER COLUMN "poolId" DROP DEFAULT;
ALTER TABLE public.images ALTER COLUMN "imageId" DROP DEFAULT;
ALTER TABLE public.accounts ALTER COLUMN "accountId" DROP DEFAULT;
DROP SEQUENCE public."users_userId_seq";
DROP TABLE public.users;
DROP SEQUENCE public."profiles_profileId_seq";
DROP TABLE public.profiles;
DROP SEQUENCE public."posts_postId_seq";
DROP TABLE public.posts;
DROP SEQUENCE public."pools_poolId_seq";
DROP TABLE public.pools;
DROP SEQUENCE public."images_imageId_seq";
DROP TABLE public.images;
DROP SEQUENCE public."accounts_accountId_seq";
DROP TABLE public.accounts;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    "accountId" integer NOT NULL,
    "accountName" character varying(255) NOT NULL,
    "accountToken" character varying(255) NOT NULL,
    "profileId" integer NOT NULL
);


--
-- Name: accounts_accountId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."accounts_accountId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accounts_accountId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."accounts_accountId_seq" OWNED BY public.accounts."accountId";


--
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    "imageId" integer NOT NULL,
    "imagePath" character varying(255) NOT NULL,
    "poolId" integer NOT NULL
);


--
-- Name: images_imageId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."images_imageId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: images_imageId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."images_imageId_seq" OWNED BY public.images."imageId";


--
-- Name: pools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pools (
    "poolId" integer NOT NULL,
    "postBody" character varying(255),
    "postTags" character varying(255),
    "profileId" integer NOT NULL
);


--
-- Name: pools_poolId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."pools_poolId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pools_poolId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."pools_poolId_seq" OWNED BY public.pools."poolId";


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    "postId" integer NOT NULL,
    "postLink" character varying(255) NOT NULL,
    "poolId" integer NOT NULL
);


--
-- Name: posts_postId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."posts_postId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: posts_postId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."posts_postId_seq" OWNED BY public.posts."postId";


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    "profileId" integer NOT NULL,
    "profileName" character varying(255) NOT NULL,
    "avatarPath" character varying(255) NOT NULL,
    "userId" integer NOT NULL
);


--
-- Name: profiles_profileId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."profiles_profileId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: profiles_profileId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."profiles_profileId_seq" OWNED BY public.profiles."profileId";


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    "userId" integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


--
-- Name: users_userId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."users_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."users_userId_seq" OWNED BY public.users."userId";


--
-- Name: accounts accountId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts ALTER COLUMN "accountId" SET DEFAULT nextval('public."accounts_accountId_seq"'::regclass);


--
-- Name: images imageId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images ALTER COLUMN "imageId" SET DEFAULT nextval('public."images_imageId_seq"'::regclass);


--
-- Name: pools poolId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pools ALTER COLUMN "poolId" SET DEFAULT nextval('public."pools_poolId_seq"'::regclass);


--
-- Name: posts postId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts ALTER COLUMN "postId" SET DEFAULT nextval('public."posts_postId_seq"'::regclass);


--
-- Name: profiles profileId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles ALTER COLUMN "profileId" SET DEFAULT nextval('public."profiles_profileId_seq"'::regclass);


--
-- Name: users userId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN "userId" SET DEFAULT nextval('public."users_userId_seq"'::regclass);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts ("accountId", "accountName", "accountToken", "profileId") FROM stdin;
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.images ("imageId", "imagePath", "poolId") FROM stdin;
\.


--
-- Data for Name: pools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pools ("poolId", "postBody", "postTags", "profileId") FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.posts ("postId", "postLink", "poolId") FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profiles ("profileId", "profileName", "avatarPath", "userId") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users ("userId", username, password) FROM stdin;
\.


--
-- Name: accounts_accountId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."accounts_accountId_seq"', 1, false);


--
-- Name: images_imageId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."images_imageId_seq"', 1, false);


--
-- Name: pools_poolId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."pools_poolId_seq"', 1, false);


--
-- Name: posts_postId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."posts_postId_seq"', 1, false);


--
-- Name: profiles_profileId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."profiles_profileId_seq"', 1, false);


--
-- Name: users_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."users_userId_seq"', 1, false);


--
-- Name: accounts accounts_accountId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "accounts_accountId_key" UNIQUE ("accountId");


--
-- Name: images images_imageId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT "images_imageId_key" UNIQUE ("imageId");


--
-- Name: pools pools_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pools
    ADD CONSTRAINT pools_pk PRIMARY KEY ("poolId");


--
-- Name: posts posts_postId_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_postId_key" UNIQUE ("postId");


--
-- Name: profiles profiles_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pk PRIMARY KEY ("profileId");


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY ("userId");


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: accounts accounts_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_fk0 FOREIGN KEY ("profileId") REFERENCES public.profiles("profileId");


--
-- Name: images images_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_fk0 FOREIGN KEY ("poolId") REFERENCES public.pools("poolId");


--
-- Name: pools pools_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pools
    ADD CONSTRAINT pools_fk0 FOREIGN KEY ("profileId") REFERENCES public.profiles("profileId");


--
-- Name: posts posts_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_fk0 FOREIGN KEY ("poolId") REFERENCES public.pools("poolId");


--
-- Name: profiles profiles_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_fk0 FOREIGN KEY ("userId") REFERENCES public.users("userId");


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

