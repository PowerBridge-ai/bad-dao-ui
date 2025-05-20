import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Checkbox,
  SimpleGrid,
  CheckboxGroup,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast
} from '@chakra-ui/react';
import { PlatformDefinition, PlatformCategory, VerificationRequest } from '../types';

interface EmailVerificationFormProps {
  platforms: PlatformDefinition[];
  onSubmit: (request: VerificationRequest) => void;
  isLoading: boolean;
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  platforms,
  onSubmit,
  isLoading
}) => {
  const [email, setEmail] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const toast = useToast();

  // Group platforms by category
  const platformsByCategory = platforms.reduce<Record<PlatformCategory, PlatformDefinition[]>>(
    (acc, platform) => {
      if (!acc[platform.category]) {
        acc[platform.category] = [];
      }
      acc[platform.category].push(platform);
      return acc;
    },
    {} as Record<PlatformCategory, PlatformDefinition[]>
  );

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address to verify',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Create verification request
    const request: VerificationRequest = {
      email,
      platforms: selectAll ? [] : selectedPlatforms
    };
    
    onSubmit(request);
  };

  // Toggle all platforms
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedPlatforms([]);
    }
  };

  // Update selected platforms
  const handlePlatformSelection = (platformIds: string[]) => {
    setSelectedPlatforms(platformIds);
    setSelectAll(false);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={6} align="stretch">
        <Heading size="lg">DevOpSec Search</Heading>
        <Text>Enter an email address to check for accounts across different platforms</Text>
        
        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address to verify"
            size="lg"
          />
        </FormControl>
        
        <FormControl>
          <FormLabel>Select Platforms</FormLabel>
          <Checkbox 
            isChecked={selectAll} 
            onChange={handleSelectAll}
            mb={4}
          >
            Check all platforms ({platforms.length})
          </Checkbox>
          
          {!selectAll && (
            <Accordion allowMultiple defaultIndex={[0]}>
              {Object.entries(platformsByCategory).map(([category, categoryPlatforms]) => (
                <AccordionItem key={category}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {category} ({categoryPlatforms.length})
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <CheckboxGroup 
                      value={selectedPlatforms} 
                      onChange={(values) => handlePlatformSelection(values as string[])}
                    >
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={2}>
                        {categoryPlatforms.map((platform) => (
                          <Checkbox key={platform.id} value={platform.id}>
                            {platform.name}
                          </Checkbox>
                        ))}
                      </SimpleGrid>
                    </CheckboxGroup>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </FormControl>
        
        <Button 
          type="submit" 
          colorScheme="blue" 
          size="lg"
          isLoading={isLoading}
          loadingText="Verifying..."
        >
          Verify Email
        </Button>
      </VStack>
    </Box>
  );
};

export default EmailVerificationForm; 