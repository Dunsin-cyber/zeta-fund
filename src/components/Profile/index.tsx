import React, { useState } from "react";
import {
  Box,
  Text,
  Flex,
  Link,
  Input,
  Button,
  Image,
  VStack,
  Show,
  Progress,
  Hide,
} from "@chakra-ui/react";
import { AppContext } from "../../Context";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar";
// import { CopyToClipboard } from "react-copy-to-clipboard";
import { CopyIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useWriteContract } from "wagmi";
import contractAbi from "../../contract/CrowdFunding-abi.json";
import toast from "react-hot-toast";

import { Transactions } from "../Campaign/Details";
import SideNav from "../SideNav";
import {
  useGetACampaign,
  useGetAllCampaigns,
  useGetUserProfile,
  useGetAllUsers,
} from "../../hooks/index";
import { useAccount } from "wagmi";
import { useAppSelector } from "../../redux/hook";
import { contractAddress } from "../../hooks";

const AnimatedCopyIcon = motion(CopyIcon);

function Index() {
  const { user } = React.useContext(AppContext);
  const location = useLocation();
  const fullUrl = window.location.origin + "/details/" + user.pda;
  const { data: dd } = useGetAllCampaigns();
  const { address } = useAccount();
  const data = useAppSelector((state) => state.campaign);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const variants = {
    normal: { scale: 1, color: "#7F7F7F" },
    hovered: { scale: 1.2 },
    clicked: { rotate: 360, scale: 1.2, color: "#341A41" },
  };

  const handleClaim = async () => {
    try {
      const hash = await writeContractAsync({
        abi: contractAbi.abi,
        address: contractAddress,
        functionName: "claim",
        args: [1],
      });

      console.log(hash);
      toast.success("claim Successful");
    } catch (err: any) {
      toast.error(err.message);
      return;
    }
  };

  console.log(address);

  return (
    <SideNav>
      {/*Selection */}
      <Flex
        mt={8}
        gap={8}
        overflowX={"scroll"}
        css={{
          "&::-webkit-scrollbar": {
            display: "none", // Hide scrollbar for Chrome, Safari, and Opera
          },
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          msOverflowStyle: "none", // Hide scrollbar for Internet Explorer and Edge
        }}
      >
        <Hide below="md">
          <OptionCard
            title={"Lending"}
            description="This feature is coming soon"
          />
          <OptionCard
            title={"Crowdfunding"}
            description="easily raise funds under 10 seconds"
          />
          <OptionCard
            title={"Borrowing"}
            description="This feature is coming soon"
          />
        </Hide>
        <Show below="md">
          <OptionCard_
            title={"Crowdfunding"}
            description="easily raise funds under 10 seconds"
          />
        </Show>
      </Flex>

      <Text my={4} mx={3} fontWeight={600}>
        Active funds
      </Text>
      {data && (
        <Box
          color="black"
          py={3}
          mx={8}
          px={8}
          borderRadius={"15px"}
          h={170}
          bgColor="white"
          gap={6}
          transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
          _hover={{
            transform: "scale(1.05)",
            boxShadow: "xl",
          }}
          cursor="pointer"
        >
          <Flex color="#5E5E5E" fontWeight={600} justify="space-between">
            <Text>{data.description}</Text>
            <Text>
              {Math.floor(
                (Number(data.amountDonated) / Number(data.amountRequired)) * 100
              )}
              %
            </Text>
          </Flex>
          <Flex color="#353535" mt={1}>
            6.6 ZETA
          </Flex>

          <Flex color="#1935C4" fontWeight={600} mt={3} justify="space-between">
            <Text>${Number(data.amountDonated)}</Text>
            <Text>${Number(data.amountRequired)}</Text>
          </Flex>
          <Progress
            color="#1935C4"
            value={Math.floor(
              (Number(data.amountDonated) / Number(data.amountRequired)) * 100
            )}
          />

          <Link>
            <Input
              fontStyle={"italic"}
              color="#7F7F7F"
              isReadOnly
              value={fullUrl}
              w={"250px"}
            />
            {/* <CopyToClipboard text={fullUrl}>
            <AnimatedCopyIcon
            style={{ color: "#7F7F7F" }}
            boxSize={6}
            variants={variants}
            initial="normal"
            animate={isClicked ? "clicked" : isHovered ? "hovered" : "normal"}
            onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => setIsClicked(!isClicked)}
            />
          </CopyToClipboard> */}
          </Link>
        </Box>
      )}
      <Button
        onClick={handleClaim}
        my={3}
        color="white"
        bgColor="purple"
        mx={8}
        px={8}
        isDisabled={true}
      >
        Claim Donation
      </Button>
    </SideNav>
  );
}

export default Index;

interface OptionType {
  title: string;
  description: string;
}

const OptionCard: React.FC<OptionType> = ({ title, description }) => {
  return (
    <Box
      maxW={"346px"}
      maxH={"208px"}
      borderRadius={"15px"}
      overflow="hidden"
      transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "xl",
      }}
      position={"relative"}
    >
      <Image
        src="crowd-funding.png"
        alt="Placeholder Image"
        w={"346px"}
        h={"208px"}
      />
      {/* <Text mt="2" color="white" position="absolute">
        crowdfunding
      </Text> */}

      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="rgba(0, 0, 0, 0.5)"
        color="white"
        opacity="0"
        transition="opacity 0.2s ease-in-out"
        _hover={{ opacity: 1 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px="4"
        cursor={"pointer"}
      >
        <VStack>
          <Text fontWeight="bold" fontSize="xl" opacity={1}>
            {title}
          </Text>
          <Text>{description}</Text>
        </VStack>
      </Box>
    </Box>
    // </Box>
  );
};
const OptionCard_: React.FC<OptionType> = ({ title, description }) => {
  return (
    <Box
      maxW={"346px"}
      maxH={"155px"}
      borderRadius={"15px"}
      overflow="hidden"
      transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "xl",
      }}
      position={"relative"}
    >
      <Image
        src="crowd-funding.png"
        alt="Placeholder Image"
        w={"346px"}
        h={"208px"}
      />
      {/* <Text mt="2" color="white" position="absolute">
        crowdfunding
      </Text> */}

      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bg="rgba(0, 0, 0, 0.5)"
        color="white"
        opacity="0"
        transition="opacity 0.2s ease-in-out"
        _hover={{ opacity: 1 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px="4"
        cursor={"pointer"}
      >
        <VStack>
          <Text fontWeight="bold" fontSize="xl" opacity={1}>
            {title}
          </Text>
          <Text>{description}</Text>
        </VStack>
      </Box>
    </Box>
    // </Box>
  );
};
